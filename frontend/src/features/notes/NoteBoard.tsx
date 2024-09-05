import { FC, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useGetNotesQuery } from "../../api"
import { useAPIErrorHandler } from "../../hooks/useAPIErrorHandler"
import NoteBoardItem from "./NoteBoardItem"
import NoteBoardToolbar from "./NoteBoardToolbar"

const NoteBoard: FC = () => {
  const [selected, setSelected] = useState<string[]>([])

  const { data: notes, error /* , isLoading */ } = useGetNotesQuery()
  const handle = useAPIErrorHandler()

  const onToggle = (noteID: string, selected: boolean) => {
    setSelected((previousSelection) =>
      selected
        ? [...previousSelection, noteID]
        : previousSelection.filter(
            (selectedNoteID) => selectedNoteID !== noteID,
          ),
    )
  }

  const onDeleteNotes = (deletedNotes: string[]) => {
    setSelected((previousSelection) =>
      previousSelection.filter(
        (selectedNoteID) => !deletedNotes.includes(selectedNoteID),
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

  // TODO: show a loading spinner when "isLoading"

  if (!notes) {
    return null
  }

  return (
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
      {notes.length && (
        <NoteBoardToolbar
          selectedNotes={selected}
          onDeleteNotes={onDeleteNotes}
          onCancelSelection={() => setSelected([])}
        />
      )}
      {!notes.length && (
        <div className="flex h-full items-center justify-center">
          <span className="text-sm/6">
            No notes yet.{" "}
            <Link to="/note/create" className="font-medium text-sky-700">
              Add one
            </Link>
          </span>
        </div>
      )}
    </>
  )
}

export default NoteBoard
