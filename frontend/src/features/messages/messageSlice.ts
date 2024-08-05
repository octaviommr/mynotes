import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type MessageSeverity = "error" | "warning" | "info" | "success"

export interface Message {
  severity: MessageSeverity
  content: string
}

// set up a discriminated union to represent the valid state mutations
export type MessageState = { open: false } | { open: true; message: Message }

// slice
const messageSlice = createSlice({
  name: "message",

  /*
    Use a type assertion to make sure the broader type is inferred for the state of the slice (otherwise "initialState"
    will be tightened to the relevant type of the discriminated union)
  */
  initialState: { open: false } satisfies MessageState as MessageState,

  /*
    Set up the case reducers using new state values that are constructed and returned. We do so not only to ensure type
    safety but also because we won't be able to mutate the existing state as needed for all state types.
  */
  reducers: {
    showMessage(state, action: PayloadAction<Message>) {
      return { open: true, message: action.payload }
    },
    closeMessage(state) {
      return { open: false }
    },
  },
})

export const { showMessage, closeMessage } = messageSlice.actions

export default messageSlice.reducer
