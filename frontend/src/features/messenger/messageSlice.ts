import { createSlice, PayloadAction, isRejected } from "@reduxjs/toolkit"
import { login, signup } from "../auth/authSlice"

export type MessageSeverity = "error" | "warning" | "info" | "success"

export interface MessageConfig {
  severity: MessageSeverity
  message: string
}

export interface MessageState {
  open: boolean
  config: MessageConfig | null
}

// slice
const initialState: MessageState = {
  open: false,
  config: null,
}

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    showMessage(state, action: PayloadAction<MessageConfig>) {
      state.open = true
      state.config = action.payload
    },

    closeMessage(state) {
      state.open = false
      state.config = null
    },
  },

  // async thunk actions
  extraReducers: (builder) => {
    builder
      // rejected actions
      .addMatcher(isRejected(login, signup), (state, action) => {
        if (!action.meta.rejectedWithValue) {
          /* 
            Automatically show an error message for unknown errors related to API calls.
            
            Known errors will be handled on a case-by-case basis by the components that made the API calls,
            since they might not necessarily lead to a message being displayed.
          */
          state.open = true
          state.config = {
            severity: "error",
            message: action.error.message!,
          }
        }
      })
  },
})

export const { showMessage, closeMessage } = messageSlice.actions

export default messageSlice.reducer
