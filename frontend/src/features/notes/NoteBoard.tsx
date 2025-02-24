import { FC, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useGetNotesQuery } from "../../api"
import { useAPIErrorHandler } from "../../hooks/useAPIErrorHandler"
import NoteBoardItem from "./NoteBoardItem"
import NoteBoardToolbar from "./NoteBoardToolbar"

const NoteBoard: FC = () => {
  const [selected, setSelected] = useState<string[]>([])

  const { data: notes, error } = useGetNotesQuery()
  const handle = useAPIErrorHandler()

  const onToggle = (noteId: string, selected: boolean) => {
    setSelected((previousSelection) =>
      selected
        ? [...previousSelection, noteId]
        : previousSelection.filter(
            (selectedNoteId) => selectedNoteId !== noteId,
          ),
    )
  }

  const onDeleteNotes = (deletedNotes: string[]) => {
    setSelected((previousSelection) =>
      previousSelection.filter(
        (selectedNoteId) => !deletedNotes.includes(selectedNoteId),
      ),
    )
  }

  // handle query errors
  useEffect(() => {
    if (error) {
      handle(error)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error])

  if (!notes) {
    return null
  }

  return (
    <>
      {notes.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-4 p-8 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-8">
            {notes.map((note) => (
              <NoteBoardItem
                key={note.id}
                note={note}
                selected={selected.includes(note.id)}
                onToggle={(selected) => onToggle(note.id, selected)}
              />
            ))}
          </div>
          <NoteBoardToolbar
            selectedNotes={selected}
            onDeleteNotes={onDeleteNotes}
            onCancelSelection={() => setSelected([])}
          />
        </>
      )}
      {!notes.length && (
        <div className="flex h-full flex-col items-center justify-center gap-2">
          <span className="text-slate-700">No notes yet.</span>
          <Link
            to="/note/create"
            className="text-sm/6 font-medium text-sky-700"
          >
            Add One
          </Link>
        </div>
      )}
    </>
  )
}

export default NoteBoard
