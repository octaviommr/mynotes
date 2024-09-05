import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit"
import { AppThunk, RootState } from "../../store"

export const SESSION_CACHE_KEY = "MYNOTES_SESSION"

export interface Session {
  token: string
  username: string
}

// set up a discriminated union to represent the valid state mutations
export type AuthState =
  | { isLoggedIn: false; attemptedURL?: string } // "attemptedURL" isn't used in the initial state or when logging out
  | { isLoggedIn: true; session: Session }

const authSlice = createSlice({
  name: "auth",

  /*
    Use a type assertion to make sure the broader type is inferred for the state of the slice (otherwise "initialState"
    will be tightened to the relevant type of the discriminated union)
  */
  initialState: { isLoggedIn: false } satisfies AuthState as AuthState,

  /*
    Set up the case reducers using new state values that are constructed and returned. We do so not only to ensure type
    safety but also because we won't be able to mutate the existing state as needed for all state types.
  */
  reducers: {
    startSession(state, action: PayloadAction<Session>) {
      return { isLoggedIn: true, session: action.payload }
    },
    endSession(state) {
      return { isLoggedIn: false }
    },
    setAttemptedURL(state, action: PayloadAction<string>) {
      return { isLoggedIn: false, attemptedURL: action.payload }
    },
  },
})

export const { setAttemptedURL } = authSlice.actions

// selectors
export const getUserInitials = createSelector(
  [
    (state: RootState) =>
      state.auth.isLoggedIn ? state.auth.session.username : undefined,
  ],
  (username) => (username ? username.charAt(0).toUpperCase() : undefined),
)

// thunks
export const login =
  (session: Session): AppThunk =>
  (dispatch) => {
    dispatch(authSlice.actions.startSession(session))

    // cache session to enable state preloading
    localStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(session))
  }

export const logout = (): AppThunk => (dispatch) => {
  dispatch(authSlice.actions.endSession())

  // clear cached session
  localStorage.removeItem(SESSION_CACHE_KEY)
}

// state preloading
export const preloadAuthState = () => {
  const serializedSession = localStorage.getItem(SESSION_CACHE_KEY)

  if (!serializedSession) return undefined

  const session = JSON.parse(serializedSession) as Session

  const state: AuthState = {
    isLoggedIn: true,
    session,
  }

  return state
}

export default authSlice.reducer
