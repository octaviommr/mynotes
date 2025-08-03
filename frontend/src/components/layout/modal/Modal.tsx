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
import type { RootState, AppDispatch } from "../../../store/store"
import { closeModal } from "./modalSlice"
import Button from "../../ui/Button"

// styles
const StyledDialog = styled(Dialog)<DialogProps>`
  position: relative;
  z-index: 50;
`

const StyledDialogBackdrop = styled(DialogBackdrop)<DialogBackdropProps>`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.3);
`

const StyledDialogPanel = styled(DialogPanel)<DialogPanelProps>`
  max-width: ${({ theme }) => theme.sizes.lg};
  margin: ${({ theme }) => theme.spacing[4]} 0;
  background-color: white;
  padding: ${({ theme }) => theme.spacing[6]};
`

const StyledDialogTitle = styled(DialogTitle)<DialogTitleProps>`
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.fontSizes["2xl"]};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`

const PanelContainer = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  width: 100vw;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[4]};
`

const ActionsContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing[4]};
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing[4]};
`
/* 
  NOTE: For Headless UI components, just passing the component to styled() does not result in the correct prop types being
  inferred by styled-components (due to how Headless UI types are defined).

  We need to explicitly set the prop types for the styled component using the types provided by Headless UI.
*/

const Modal: React.FC = () => {
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
          <PanelContainer>
            <StyledDialogPanel>
              <StyledDialogTitle>{modalState.modal.title}</StyledDialogTitle>
              <p>{modalState.modal.content}</p>
              <ActionsContainer>
                {modalState.modal.type === "alert" && (
                  <Button
                    onClick={() => dispatch(closeModal(false))}
                    variant="secondary"
                  >
                    {modalState.modal.cancelLabel}
                  </Button>
                )}
                <Button onClick={() => dispatch(closeModal(true))}>
                  {modalState.modal.okLabel}
                </Button>
              </ActionsContainer>
            </StyledDialogPanel>
          </PanelContainer>
        </StyledDialog>
      )}
    </>
  )
}

export default Modal
