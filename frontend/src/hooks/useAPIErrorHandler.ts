import { useCallback } from "react"
import { useSelector, useDispatch } from "react-redux"
import { SerializedError } from "@reduxjs/toolkit"
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react"
import { useNavigate } from "react-router-dom"
import { RootState, AppDispatch } from "../store"
import { showMessage } from "../features/messages/messageSlice"
import { logOut } from "../features/auth/authSlice"

export const useAPIErrorHandler = () => {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth)

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const handle = useCallback(
    (error: FetchBaseQueryError | SerializedError) => {
      /*
        Narrow the type of the error to check if it's specifically a "FetchBaseQueryError" representing an error response
        returned from the API
      */
      if ("status" in error && typeof error.status === "number") {
        const message = (error.data as { message: string }).message

        // show the error message
        dispatch(showMessage({ severity: "error", content: message }))

        if (error.status === 401 && isLoggedIn) {
          // session has expired or is invalid so let's also log the user out
          dispatch(logOut())

          // and redirect to the log in screen
          navigate("/login")
        }

        return
      }

      // an unknown error has occurred when querying the API so let's just show a generic error message
      dispatch(
        showMessage({
          severity: "error",
          content: "An unknown error has occurred.",
        }),
      )

      // and also log the error
      console.error(error)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoggedIn],
  )

  return handle
}
