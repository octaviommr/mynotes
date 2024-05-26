import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
import authReducer, {
  preloadAuthState,
  preloadToken,
} from "./features/auth/authSlice"
import messageReducer from "./features/messenger/messageSlice"

export const store = configureStore({
  reducer: { auth: authReducer, message: messageReducer },
  preloadedState: {
    auth: preloadAuthState(),
  },

  /*
    Use the "extra" argument of the default thunk middleware to hold the authentication token.

    This allows easier access to the token in async thunks since we can get it directly from the thunk API,
    instead of having to use the "getState" method to get it from the store.
  */
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: preloadToken(),
      },
    }),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  { token: string },
  Action<string>
>

export type RequestStatus = "idle" | "loading" | "failed"

export interface APIError {
  status: number
  message: string
}
