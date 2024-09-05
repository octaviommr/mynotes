import { FC } from "react"
import { useSelector, useDispatch } from "react-redux"
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Button,
} from "@headlessui/react"
import { RootState, AppDispatch } from "../../store"
import { closeModal } from "./modalSlice"

const ModalPresenter: FC = () => {
  const modalState = useSelector((state: RootState) => state.modal)

  const dispatch = useDispatch<AppDispatch>()

  return (
    <>
      {modalState.open && (
        <Dialog
          open={modalState.open}
          onClose={() => dispatch(closeModal(false))}
          className="relative z-50"
          role={modalState.modal.type === "alert" ? "alertdialog" : "dialog"}
        >
          <DialogBackdrop className="fixed inset-0 bg-black/30" />
          <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
            <DialogPanel className="max-w-lg space-y-4 bg-white p-12">
              <DialogTitle className="text-2xl font-bold">
                {modalState.modal.title}
              </DialogTitle>
              <p className="text-slate-700">{modalState.modal.content}</p>
              <div className="flex justify-end gap-4">
                {modalState.modal.type === "alert" && (
                  <Button
                    type="button"
                    className="rounded-md border border-gray-300 px-3 py-1.5 text-sm/6"
                    onClick={() => dispatch(closeModal(false))}
                  >
                    {modalState.modal.cancelLabel}
                  </Button>
                )}
                <Button
                  type="button"
                  className="rounded-md bg-sky-700 px-3 py-1.5 text-sm/6 font-semibold text-white"
                  onClick={() => dispatch(closeModal(true))}
                >
                  {modalState.modal.okLabel}
                </Button>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      )}
    </>
  )
}

export default ModalPresenter
