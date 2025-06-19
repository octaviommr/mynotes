import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type MessageSeverity = "error" | "warning" | "info" | "success"

export interface Message {
  severity: MessageSeverity
  content: string
}

// set up a discriminated union to represent the valid states
export type MessageState =
  | { open: false; message?: Message }
  | { open: true; message: Message }

// slice
const messageSlice = createSlice({
  name: "message",

  /*
    Use a type assertion to make sure the broader type is inferred for the state of the slice (otherwise "initialState"
    will be tightened to the relevant type of the discriminated union)
  */
  initialState: { open: false } satisfies MessageState as MessageState,

  reducers: {
    showMessage(state, action: PayloadAction<Message>) {
      state.open = true
      state.message = action.payload
    },
    closeMessage(state) {
      state.open = false
    },
  },
})

export const { showMessage, closeMessage } = messageSlice.actions

export default messageSlice.reducer
