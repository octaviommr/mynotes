import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { AppThunk } from "./store"

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

// set up a discriminated union to represent the valid states
export type ModalState =
  | { open: false; modal?: Modal }
  | { open: true; modal: Modal }

// slice
const modalSlice = createSlice({
  name: "modal",

  /*
    Use a type assertion to make sure the broader type is inferred for the state of the slice (otherwise "initialState"
    will be tightened to the relevant type of the discriminated union)
  */
  initialState: { open: false } satisfies ModalState as ModalState,

  reducers: {
    showModal(state, action: PayloadAction<Modal>) {
      state.open = true
      state.modal = action.payload
    },
    closeModal(state) {
      state.open = false
    },
  },
})

/*
  Set up the thunks used to control the modal state.

  In this case, we can't just use actions since we need side effects associated with the state transitions in order to
  return a promise of the modal result to the user, but reducers must be pure.
    
  Instead, we provide thunks that run the needed side effects, besides dispatching actions to update the state.
*/
let resolveResult: (value: boolean) => void // this will hold the function used to resolve the promise of the modal result

export const showModal =
  (modal: Modal): AppThunk<Promise<boolean>> =>
  (dispatch) => {
    dispatch(modalSlice.actions.showModal(modal))

    // return a promise which will be resolved with the modal result once the user closes it
    return new Promise((resolve) => {
      resolveResult = resolve
    })
  }

export const closeModal =
  (result: boolean): AppThunk =>
  (dispatch) => {
    resolveResult(result)

    dispatch(modalSlice.actions.closeModal())
  }

export default modalSlice.reducer
