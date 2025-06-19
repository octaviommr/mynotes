import { FC } from "react"
import { useSelector, useDispatch } from "react-redux"
import styled from "styled-components"
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  type DialogProps,
  type DialogBackdropProps,
  type DialogPanelProps,
  type DialogTitleProps,
} from "@headlessui/react"
import type { RootState, AppDispatch } from "../../store/store"
import { closeModal } from "../../store/modalSlice"
import Button from "../../components/Button"

// styles
const StyledDialog = styled((props: DialogProps) => <Dialog {...props} />)`
  position: relative;
  z-index: 50;
`

const StyledDialogBackdrop = styled((props: DialogBackdropProps) => (
  <DialogBackdrop {...props} />
))`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.3);
`

const StyledDialogPanel = styled((props: DialogPanelProps) => (
  <DialogPanel {...props} />
))`
  max-width: ${({ theme }) => theme.sizes.lg};
  margin: ${({ theme }) => theme.spacing[4]} 0;
  background-color: white;
  padding: ${({ theme }) => theme.spacing[6]};
`

const StyledDialogTitle = styled((props: DialogTitleProps) => (
  <DialogTitle {...props} />
))`
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.fontSizes["2xl"]};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`
/* 
  NOTE: In the case of the above Headless UI components, simply passing the component into "styled()", thus letting
  styled-components figure out the type of the component props, won't yield the correct type. 
  
  We need to use the type supplied by Headless UI for the component props by explicitly defining the components to be
  rendered.
*/

const ModalPanelContainer = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  width: 100vw;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[4]};
`

const ModalActionContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing[4]};
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing[4]};
`

const Modal: FC = () => {
  const modalState = useSelector((state: RootState) => state.modal)

  const dispatch = useDispatch<AppDispatch>()

  return (
    <>
      {modalState.open && (
        <StyledDialog
          open={modalState.open}
          onClose={() => dispatch(closeModal(false))}
          role={modalState.modal.type === "alert" ? "alertdialog" : "dialog"}
        >
          <StyledDialogBackdrop />
          <ModalPanelContainer>
            <StyledDialogPanel>
              <StyledDialogTitle>{modalState.modal.title}</StyledDialogTitle>
              <p>{modalState.modal.content}</p>
              <ModalActionContainer>
                {modalState.modal.type === "alert" && (
                  <Button
                    onClick={() => dispatch(closeModal(false))}
                    $variant="secondary"
                  >
                    {modalState.modal.cancelLabel}
                  </Button>
                )}
                <Button onClick={() => dispatch(closeModal(true))}>
                  {modalState.modal.okLabel}
                </Button>
              </ModalActionContainer>
            </StyledDialogPanel>
          </ModalPanelContainer>
        </StyledDialog>
      )}
    </>
  )
}

export default Modal
