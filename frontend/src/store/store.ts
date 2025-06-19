import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
import { api } from "../api/api"
import authReducer, { preloadAuthState } from "./authSlice"
import messageReducer from "./messageSlice"
import modalReducer from "./modalSlice"

// set up a function to create the store so that it can also be used in tests
export const createStore = () =>
  configureStore({
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

export const store = createStore()

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
