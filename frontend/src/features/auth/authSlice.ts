import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  isAnyOf,
  createSelector,
} from "@reduxjs/toolkit"
import { APIError, AppThunk, RequestStatus, RootState } from "../../store"
import authAPI from "./authAPI"

const SESSION_CACHE_KEY = "MYNOTES_SESSION"

export interface Session {
  token: string
  username: string
}

export interface AuthState {
  isLoggedIn: boolean
  session: Session | null
  returnURL: string
  status: RequestStatus
}

const initialState: AuthState = {
  isLoggedIn: false,
  session: null,
  returnURL: "",
  status: "idle",
}

// async thunks
export const login = createAsyncThunk<
  Session,
  { email: string; password: string },
  { rejectValue: APIError; extra: { token: string } }
>("auth/login", async ({ email, password }, { rejectWithValue, extra }) => {
  const response = await authAPI.login(email, password)

  const data = await response.json()

  if (!response.ok) {
    return rejectWithValue({
      status: response.status,
      message: data.message as string,
    })
  }

  const session: Session = {
    token: data.token as string,
    username: data.username as string,
  }

  // cache session for state preloading purposes
  const serializedSession = JSON.stringify(session)

  localStorage.setItem(SESSION_CACHE_KEY, serializedSession)

  // store the authentication token in thunk middleware
  extra.token = session.token

  return session
})

export const signup = createAsyncThunk<
  void,
  { email: string; username: string; password: string },
  { rejectValue: APIError }
>("auth/signup", async ({ email, username, password }, { rejectWithValue }) => {
  const response = await authAPI.signup(email, username, password)

  if (!response.ok) {
    const data = await response.json()

    return rejectWithValue({
      status: response.status,
      message: data.message as string,
    })
  }

  // no need to return anything so far
  return
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearSession(state) {
      state.session = null
      state.isLoggedIn = false
    },

    setReturnURL(state, action: PayloadAction<string>) {
      state.returnURL = action.payload
    },

    clearReturnURL(state) {
      state.returnURL = ""
    },
  },

  // async thunk actions
  extraReducers: (builder) => {
    builder
      // login
      .addCase(login.fulfilled, (state, action) => {
        state.status = "idle"
        state.session = action.payload
        state.isLoggedIn = true
      })

      // signup
      .addCase(signup.fulfilled, (state) => {
        state.status = "idle"
      })

      // pending actions
      .addMatcher(isAnyOf(login.pending, signup.pending), (state) => {
        state.status = "loading"
      })

      // rejected actions
      .addMatcher(isAnyOf(login.rejected, signup.rejected), (state) => {
        state.status = "failed"
      })
  },
})

export const { clearSession, setReturnURL, clearReturnURL } = authSlice.actions

// selectors
export const getUserInitials = createSelector(
  [(state: RootState) => state.auth.session?.username],
  (username) => (username ? username.charAt(0).toUpperCase() : ""),
)

// thunks
export const logout = (): AppThunk => (dispatch, _, extraArgument) => {
  dispatch(authSlice.actions.clearSession())

  // clear cached session
  localStorage.removeItem(SESSION_CACHE_KEY)

  // clear authentication token in thunk middleware
  extraArgument.token = ""
}

// state preloading
export const preloadAuthState = () => {
  const serializedSession = localStorage.getItem(SESSION_CACHE_KEY)

  if (!serializedSession) return undefined

  const session = JSON.parse(serializedSession) as Session

  const state: AuthState = {
    isLoggedIn: true,
    session,
    returnURL: "",
    status: "idle",
  }

  return state
}

export const preloadToken = () => {
  const serializedSession = localStorage.getItem(SESSION_CACHE_KEY)

  if (!serializedSession) return { token: "" }

  const { token } = JSON.parse(serializedSession) as Session

  return { token }
}

export default authSlice.reducer
