import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RootState } from "../store/store"

export const BASE_API_URL = process.env.REACT_APP_API_URL

/* 
  Set up the service to query the API. 
    
  This will be extended by each feature, which will inject its own endpoints.
*/
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const authState = (getState() as RootState).auth

      if (authState.isLoggedIn) {
        headers.set("authorization", `Bearer ${authState.session.token}`)
      }

      return headers
    },
  }),
  tagTypes: ["Notes", "UNAUTHORIZED", "SESSION"],
  endpoints: () => ({}),
})
