import { FC, useEffect, useState } from "react"
import styled from "styled-components"
import { useGetNotesQuery } from "../notesApi"
import { useAPIErrorHandler } from "../../../hooks/useAPIErrorHandler"
import NoteBoardItem from "./NoteBoardItem"
import NoteBoardToolbar from "./NoteBoardToolbar"
import Link from "../../../components/ui/Link"

// styles
const NoteBoardContainer = styled.ul`
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[8]};

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: ${({ theme }) => theme.spacing[8]};
  }
`

const NoNotesContainer = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
`

const NoteBoard: FC = () => {
  const [selected, setSelected] = useState<string[]>([])

  const { data: notes, error } = useGetNotesQuery()
  const handle = useAPIErrorHandler()

  // handle query errors
  useEffect(() => {
    if (error) {
      handle(error)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error])

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

  if (!notes) {
    return null
  }

  return (
    <>
      {notes.length > 0 && (
        <>
          <NoteBoardContainer>
            {notes.map((note) => (
              <NoteBoardItem
                key={note.id}
                note={note}
                selected={selected.includes(note.id)}
                onToggle={(selected) => onToggle(note.id, selected)}
              />
            ))}
          </NoteBoardContainer>
          <NoteBoardToolbar
            selectedNotes={selected}
            onDeleteNotes={onDeleteNotes}
            onCancelSelection={() => setSelected([])}
          />
        </>
      )}
      {!notes.length && (
        <NoNotesContainer>
          <p>No notes yet.</p>
          <Link to="/note/create">Add One</Link>
        </NoNotesContainer>
      )}
    </>
  )
}

export default NoteBoard
