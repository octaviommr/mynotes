import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit"
import { AppThunk, RootState } from "../../store"

export const SESSION_CACHE_KEY = "MYNOTES_SESSION"

export interface Session {
  token: string
  name: string
}

// set up a discriminated union to represent the valid state mutations
export type AuthState =
  | { isLoggedIn: false; session: undefined } // still define a "session" prop so we can use Immer in reducers
  | { isLoggedIn: true; session: Session }

const authSlice = createSlice({
  name: "auth",

  /*
    Use a type assertion to make sure the broader type is inferred for the state of the slice (otherwise "initialState"
    will be tightened to the relevant type of the discriminated union)
  */
  initialState: {
    isLoggedIn: false,
    session: undefined,
  } satisfies AuthState as AuthState,

  reducers: {
    startSession(state, action: PayloadAction<Session>) {
      state.isLoggedIn = true
      state.session = action.payload
    },
    endSession(state) {
      state.isLoggedIn = false
      state.session = undefined
    },
  },
})

// selectors
export const getUserInitials = createSelector(
  [
    (state: RootState) =>
      state.auth.isLoggedIn ? state.auth.session.name : undefined,
  ],
  (name) => (name ? name.charAt(0).toUpperCase() : undefined),
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
