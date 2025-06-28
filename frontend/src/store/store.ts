import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
import { baseApi } from "../api/baseApi"
import authReducer, { preloadAuthState } from "../features/auth/authSlice"
import messageReducer from "../components/layout/message/messageSlice"
import modalReducer from "../components/layout/modal/modalSlice"

// set up a function to create the store so that it can also be used in tests
export const createStore = () =>
  configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      auth: authReducer,
      message: messageReducer,
      modal: modalReducer,
    },

    // add middleware for the API slices
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),

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
