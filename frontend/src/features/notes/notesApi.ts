import { baseApi } from "../../api/baseApi"
import type { NoteResponse, Note } from "./types/Note"

// set up the backend-to-frontend model transformer
const makeNote = ({ _id, title, content, important }: NoteResponse): Note => ({
  id: _id,
  title,
  content,
  important,
})

// set up the service to query the API
export const notesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
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
  }),
})

export const {
  useGetNotesQuery,
  useGetNoteQuery,
  useAddNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
  useDeleteNotesMutation,
} = notesApi
