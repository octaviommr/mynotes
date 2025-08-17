import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit"
import type { AppThunk, RootState } from "../../store/store"

export const SESSION_CACHE_KEY = "MYNOTES_SESSION"

export interface Session {
  token: string
  name: string
}

// set up a discriminated union to represent the valid states
export type AuthState =
  | { isLoggedIn: false; session?: null }
  | { isLoggedIn: true; session: Session }
/*
  NOTE: Another option for the logged out state that would still allow us to use Immer in the "endSession" action while
  ensuring there's never a session when the user is logged out, would be defining the session property as "session?: never"
  or "session?: undefined".
  
  But this would force us to assign "undefined" to the session in the action, which semantically doesn't make sense, since 
  an "undefined" property in a object means that the property is missing in that object.
*/

const authSlice = createSlice({
  name: "auth",

  /*
    Use a type assertion to make sure the broader type is inferred for the state of the slice (otherwise "initialState"
    will be tightened to the relevant type of the discriminated union)
  */
  initialState: {
    isLoggedIn: false,
  } satisfies AuthState as AuthState,

  reducers: {
    startSession(state, action: PayloadAction<Session>) {
      state.isLoggedIn = true
      state.session = action.payload
    },
    endSession(state) {
      state.isLoggedIn = false
      state.session = null
    },
  },
})

// selectors
export const getUserInitials = createSelector(
  [
    (state: RootState) =>
      state.auth.isLoggedIn ? state.auth.session.name : "",
  ],
  (name) => (name ? name.charAt(0).toUpperCase() : ""),
)

/*
  Set up the thunks used to control the authentication state.

  In this case, we can't just use actions since we need side effects associated with the state transitions in order to
  handle the caching of the session, but reducers must be pure.
    
  Instead, we provide thunks that run the needed side effects, besides dispatching actions to update the state.
*/
export const logIn =
  (session: Session): AppThunk =>
  (dispatch) => {
    dispatch(authSlice.actions.startSession(session))

    // cache session to enable state preloading
    localStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(session))
  }

export const logOut = (): AppThunk => (dispatch) => {
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
