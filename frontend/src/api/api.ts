import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RootState } from "../store/store"
import { Session } from "../store/authSlice"

export const BASE_URL = process.env.REACT_APP_API_URL

/* 
  Set up models for back-end responses and front-end objects.

  This highlights the importance of NOT cloning back-end data models in the front-end. 

  Front-end models are usually different from back-end ones because they have different concerns. A front-end model
  might include only some of the props of the back-end model, since the rest might not be needed in the front-end. On the
  other hand, a front-end model might contain some props that don't exist in the back-end model, due to only being relevant
  for UI logic.

  We should only pick the props we care about for the front-end, and then use those to build the actual front-end objects.
  Just as an example, here we're ignoring the "userId" prop of the note objects that we get from the back-end (since a user
  will only ever interact with their own notes), and we're also replacing the "_id" prop with the "id" prop which has a
  slightly different, friendlier name.
*/
export interface NoteResponse {
  _id: string
  title: string
  content?: string
  important?: boolean
}

export type Note = Omit<NoteResponse, "_id"> & { id: string }

const makeNote = ({ _id, title, content, important }: NoteResponse): Note => ({
  id: _id,
  title,
  content,
  important,
})

interface UserResponse {
  _id: string
  email: string
  name: string
}

export type User = Omit<UserResponse, "_id"> & { id: string }

const makeUser = ({ _id, email, name }: UserResponse): User => ({
  id: _id,
  email,
  name,
})

export type UserCredentials = Pick<User, "email"> & { password: string }
export type UserSignUp = Omit<User, "id"> & Pick<UserCredentials, "password">

// set up the service to query the API
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const authState = (getState() as RootState).auth

      if (authState.isLoggedIn) {
        headers.set("authorization", `Bearer ${authState.session.token}`)
      }

      return headers
    },
  }),
  tagTypes: ["Notes", "UNAUTHORIZED", "SESSION"],
  endpoints: (build) => ({
    // notes
    getNotes: build.query<Note[], void>({
      query: () => "/notes",
      transformResponse: (response: NoteResponse[]) => response.map(makeNote),
      providesTags: (result, error) => {
        if (result) {
          return [
            ...result.map(({ id }) => ({ type: "Notes", id }) as const),

            // query should also be refetched when the list itself changes (ie. when a new note is added)
            { type: "Notes", id: "LIST" },

            // and also when a different user logs in
            "SESSION",
          ]
        }

        if (error!.status === 401) {
          /*
            Session has expired or is invalid so the query should be refetched when we have a valid session again
            (ie. after the user successfully logs in)
          */
          return ["UNAUTHORIZED"]
        }

        // an uknown error has occurred so we can't tell when the query should be refetched
        return []
      },
    }),
    getNote: build.query<Note, string>({
      query: (id) => `/notes/${id}`,
      transformResponse: (response: NoteResponse) => makeNote(response),
      providesTags: (result, error, id) => {
        if (result) {
          return [
            { type: "Notes", id },

            // query should also be refetched when a different user logs in
            "SESSION",
          ]
        }

        if (error!.status === 401) {
          /*
            Session has expired or is invalid so the query should be refetched when we have a valid session again
            (ie. after the user successfully logs in)
          */
          return ["UNAUTHORIZED"]
        }

        if (error!.status === 404) {
          /* 
            Note was not found so the query should be refetched if a note is ever created with the attempted ID
            (even though that's highly unlikely)          
          */
          return [{ type: "Notes", id }]
        }

        if (error!.status === 403) {
          // access was denied so the query should be refetched if the user that owns the note logs in
          return ["SESSION"]
        }

        // an uknown error has occurred so we can't tell when the query should be refetched
        return []
      },
    }),
    addNote: build.mutation<Note, Omit<Note, "id">>({
      query: (body) => ({
        url: "/notes",
        method: "POST",
        body,
      }),
      transformResponse: (response: NoteResponse) => makeNote(response),
      invalidatesTags: (result) => {
        if (result) {
          return [{ type: "Notes", id: "LIST" }]
        }

        // an error has occurred so nothing has changed and no queries need to be refetched
        return []
      },
    }),
    updateNote: build.mutation<Note, Note>({
      query: ({ id, ...body }) => ({
        url: `/notes/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: NoteResponse) => makeNote(response),
      invalidatesTags: (result, error, { id }) => {
        if (result) {
          return [{ type: "Notes", id }]
        }

        // an error has occurred so nothing has changed and no queries need to be refetched
        return []
      },
    }),
    deleteNote: build.mutation<undefined, string>({
      query: (id) => ({
        url: `/notes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => {
        /* 
          We need to use "error" in this case when checking for a successful response since those will have an
          undefined body
        */
        if (!error) {
          return [{ type: "Notes", id }]
        }

        // an error has occurred so nothing has changed and no queries need to be refetched
        return []
      },
    }),
    deleteNotes: build.mutation<{ deletedIds: string[] }, string[]>({
      query: (ids) => ({
        url: "/notes/deleteBatch",
        method: "POST",
        body: { ids },
      }),
      invalidatesTags: (result) => {
        if (result) {
          return result.deletedIds.map((id) => ({ type: "Notes", id }))
        }

        // an error has occurred so nothing has changed and no queries need to be refetched
        return []
      },
    }),

    // authentication
    logIn: build.mutation<Session, UserCredentials>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: (result) => {
        if (result) {
          return ["UNAUTHORIZED", "SESSION"]
        }

        // an error has occurred so nothing has changed and no queries need to be refetched
        return []
      },
    }),
    signUp: build.mutation<User, UserSignUp>({
      query: (body) => ({
        url: "/auth/signup",
        method: "POST",
        body,
      }),
      transformResponse: (response: UserResponse) => makeUser(response),
    }),
  }),
})

export const {
  useGetNotesQuery,
  useGetNoteQuery,
  useAddNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
  useDeleteNotesMutation,
  useLogInMutation,
  useSignUpMutation,
} = api
