import { createSlice, PayloadAction } from "@reduxjs/toolkit"

// set up a discriminated union to represent the available modal types
export type Modal =
  | {
      type: "notification"
      title: string
      content: string
      okLabel: string
    }
  | {
      type: "alert"
      title: string
      content: string
      okLabel: string
      cancelLabel: string
    }

// set up a discriminated union to represent the valid state mutations
export type ModalState =
  | { open: true; modal: Modal }
  | { open: false; result?: boolean } // "result" isn't used in the initial state

// slice
const modalSlice = createSlice({
  name: "modal",

  /*
    Use a type assertion to make sure the broader type is inferred for the state of the slice (otherwise "initialState"
    will be tightened to the relevant type of the discriminated union)
  */
  initialState: { open: false } satisfies ModalState as ModalState,

  /*
    Set up the case reducers using new state values that are constructed and returned. We do so not only to ensure type
    safety but also because we won't be able to mutate the existing state as needed for all state types.
  */
  reducers: {
    showModal(state, action: PayloadAction<Modal>) {
      return { open: true, modal: action.payload }
    },
    closeModal(state, action: PayloadAction<boolean>) {
      return { open: false, result: action.payload }
    },
  },
})

export const { showModal, closeModal } = modalSlice.actions

export default modalSlice.reducer
