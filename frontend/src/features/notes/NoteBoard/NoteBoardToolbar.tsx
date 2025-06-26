import { FC, useEffect } from "react"
import { useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import styled from "styled-components"
import { Button, type ButtonProps } from "@headlessui/react"
import { PlusIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/solid"
import type { AppDispatch } from "../../../store/store"
import { useDeleteNotesMutation } from "../notesApi"
import { useAPIErrorHandler } from "../../../hooks/useAPIErrorHandler"
import { showModal } from "../../../components/layout/modal/modalSlice"
import { showMessage } from "../../../components/layout/message/messageSlice"

interface NoteBoardToolbarProps {
  selectedNotes: string[]
  onDeleteNotes: (deletedNotes: string[]) => void
  onCancelSelection: () => void
}

// styles
const ToolbarContainer = styled.div`
  position: fixed;
  left: 0px;
  right: 0px;
  bottom: ${({ theme }) => theme.spacing[8]};
  display: flex;
  justify-content: center;
`

const ToolbarButton = styled((props: ButtonProps) => <Button {...props} />)`
  display: inline-flex;
  width: ${({ theme }) => theme.sizes[10]};
  height: ${({ theme }) => theme.sizes[10]};
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadiuses.full};
`
/* 
  NOTE: In the case of the above Headless UI component, simply passing the component into "styled()", thus letting
  styled-components figure out the type of the component props, won't yield the correct type. 
  
  We need to use the type supplied by Headless UI for the component props by explicitly defining the component to be
  rendered.
*/

const ToolbarIcon = styled.svg`
  width: ${({ theme }) => theme.sizes[6]};
  height: ${({ theme }) => theme.sizes[6]};
`

const SelectedNotesCount = styled.span.attrs({ role: "status" })`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`

const Toolbar = styled.section.attrs({ role: "toolbar" })<{
  $selected?: boolean
}>`
  position: relative;
  display: flex;
  width: ${({ theme }) => theme.sizes[56]};
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadiuses.full};

  background-color: ${({ theme, $selected }) =>
    $selected ? theme.colors["error-light"] : theme.colors["primary-light"]};

  padding: ${({ theme }) => theme.spacing[2]} 0;

  > ${ToolbarButton} {
    background-color: ${({ theme, $selected }) =>
      $selected ? theme.colors.error : theme.colors.primary};

    > ${ToolbarIcon} {
      fill: white;
    }
  }

  > div {
    position: absolute;
    top: 0;
    bottom: 0;
    left: ${({ theme }) => theme.spacing[4]};
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing[1]};

    ${ToolbarIcon} {
      fill: ${({ theme }) => theme.colors.error};
    }

    > ${SelectedNotesCount} {
      color: ${({ theme }) => theme.colors.error};
    }
  }
`

const NoteBoardToolbar: FC<NoteBoardToolbarProps> = ({
  selectedNotes,
  onDeleteNotes,
  onCancelSelection,
}) => {
  const dispatch = useDispatch<AppDispatch>()

  const [runDeleteNotesMutation, { data, error }] = useDeleteNotesMutation()
  const handle = useAPIErrorHandler()

  // handle mutation results
  useEffect(() => {
    if (data) {
      const allDeleted = data.deletedIds.length === selectedNotes.length

      // show a success/warning message
      dispatch(
        showMessage({
          severity: allDeleted ? "success" : "warning",
          content: allDeleted
            ? "Notes deleted successfully!"
            : "Some notes could not be deleted.",
        }),
      )

      onDeleteNotes(data.deletedIds)
    }

    if (error) {
      // delete operation failed so let's handle the error
      handle(error)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error])

  const deleteNotes = async () => {
    const result = await dispatch(
      showModal({
        type: "alert",
        title: "Delete Notes",
        content: "Are you sure you want to delete the selected notes?",
        okLabel: "Delete",
        cancelLabel: "Cancel",
      }),
    )

    if (result) {
      runDeleteNotesMutation(selectedNotes)
    }
  }

  return (
    <ToolbarContainer>
      <Toolbar $selected={selectedNotes.length > 0}>
        {selectedNotes.length > 0 && (
          <>
            <ToolbarButton onClick={() => deleteNotes()} aria-label="Delete">
              <ToolbarIcon as={TrashIcon} />
            </ToolbarButton>
            <div>
              <Button
                onClick={() => onCancelSelection()}
                aria-label="Clear selection"
              >
                <ToolbarIcon as={XMarkIcon} />
              </Button>
              <SelectedNotesCount>{selectedNotes.length}</SelectedNotesCount>
            </div>
          </>
        )}
        {!selectedNotes.length && (
          <ToolbarButton as={Link} to="/note/create" aria-label="Add">
            <ToolbarIcon as={PlusIcon} />
          </ToolbarButton>
        )}
      </Toolbar>
    </ToolbarContainer>
  )
}

export default NoteBoardToolbar
