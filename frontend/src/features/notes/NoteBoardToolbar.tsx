import { FC, useEffect } from "react"
import { useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { PlusIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/solid"
import { Button } from "@headlessui/react"
import { AppDispatch } from "../../store"
import { useDeleteNotesMutation } from "../../api"
import { useAPIErrorHandler } from "../../hooks/useAPIErrorHandler"
import { useModal } from "../../hooks/useModal"
import { showMessage } from "../messages/messageSlice"

interface NoteBoardToolbarProps {
  selectedNotes: string[]
  onDeleteNotes: (deletedNotes: string[]) => void
  onCancelSelection: () => void
}

const NoteBoardToolbar: FC<NoteBoardToolbarProps> = ({
  selectedNotes,
  onDeleteNotes,
  onCancelSelection,
}) => {
  const dispatch = useDispatch<AppDispatch>()

  const [runDeleteNotesMutation, { data, error }] = useDeleteNotesMutation()
  const handle = useAPIErrorHandler()

  const showModal = useModal()

  const deleteNotes = () => {
    showModal(
      {
        type: "alert",
        title: "Delete notes",
        content: "Are you sure you want to delete the selected notes?",
        okLabel: "Delete",
        cancelLabel: "Cancel",
      },
      (result) => {
        if (result) {
          runDeleteNotesMutation(selectedNotes)
        }
      },
    )
  }

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

  // set up a data attribute to be able to conditionally apply styling when one or more notes are selected
  const dataAttrs = { ...(selectedNotes.length && { "data-selected": true }) }

  return (
    <div className="fixed inset-x-0 bottom-8 flex justify-center">
      <div
        className="relative flex w-56 justify-center rounded-full bg-sky-100 py-2 data-[selected]:bg-red-100"
        {...dataAttrs}
      >
        {selectedNotes.length > 0 && (
          <>
            <Button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-full bg-red-700"
              onClick={() => deleteNotes()}
            >
              <TrashIcon className="size-6 fill-white" />
            </Button>
            <div className="absolute inset-y-0 left-4 flex items-center gap-1">
              <Button
                type="button"
                className="inline-flex items-center gap-2"
                onClick={() => onCancelSelection()}
              >
                <XMarkIcon className="size-6 fill-red-700" />
              </Button>
              <span className="font-medium text-red-700">
                {selectedNotes.length}
              </span>
            </div>
          </>
        )}
        {!selectedNotes.length && (
          <Link
            to="/note/create"
            className="inline-flex size-10 items-center justify-center rounded-full bg-sky-700"
          >
            <PlusIcon className="size-6 fill-white" />
          </Link>
        )}
      </div>
    </div>
  )
}

export default NoteBoardToolbar
