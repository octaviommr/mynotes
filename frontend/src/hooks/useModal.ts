import { useEffect, useCallback, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { RootState, AppDispatch } from "../store"
import {
  Modal,
  showModal as showModalAction,
} from "../features/modals/modalSlice"

export type ModalCloseHandler = (result: boolean) => void

export const useModal = () => {
  const modalState = useSelector((state: RootState) => state.modal)

  /*
    Set up a ref to store the close handler whenever we show a modal. Whenever a modal is closed (or is already closed on
    component mount), this will allow us to know if that's one we've shown and handle the close event.

    Since what we're persisting doesn't impact the hook return value, we can use a ref instead of state, thus avoiding
    unnecessary re-renders. 
  */
  const closeHandlerRef = useRef<ModalCloseHandler>()

  const dispatch = useDispatch<AppDispatch>()

  const showModal = useCallback(
    (modal: Modal, onClose: ModalCloseHandler) => {
      dispatch(showModalAction(modal))

      // store close handler to allow us to know when the modal is closed and handle the close event
      closeHandlerRef.current = onClose
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  // handle modal close event
  useEffect(() => {
    // check if a modal we've shown was closed (by checking if we have a stored close handler)
    if (!modalState.open && closeHandlerRef.current) {
      closeHandlerRef.current(modalState.result!)

      // clear close handler since the modal close event was just handled
      closeHandlerRef.current = undefined
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalState.open])

  return showModal
}
