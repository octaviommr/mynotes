import { baseApi } from "../api/baseApi"
import type { Session } from "./authSlice"
import type {
  UserResponse,
  User,
  UserCredentials,
  UserSignUp,
} from "./types/User"

// set up the backend-to-frontend model transformer
const makeUser = ({ _id, email, name }: UserResponse): User => ({
  id: _id,
  email,
  name,
})

// set up the service to query the API
export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
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

export const { useLogInMutation, useSignUpMutation } = authApi
