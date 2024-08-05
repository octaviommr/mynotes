import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
import { api } from "./api"
import authReducer, { preloadAuthState } from "./features/auth/authSlice"
import messageReducer from "./features/messages/messageSlice"
import modalReducer from "./features/modals/modalSlice"

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
    message: messageReducer,
    modal: modalReducer,
  },

  // add the API middleware
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),

  // preload any existing session from local storage
  preloadedState: {
    auth: preloadAuthState(),
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
