import styled from "styled-components"
import { PencilSquareIcon } from "@heroicons/react/16/solid"
import { Note } from "../types/Note"
import Checkbox from "../../../components/ui/Checkbox"
import Spacer from "../../../components/ui/Spacer"
import Link from "../../../components/ui/Link"

interface NoteBoardItemProps {
  note: Note
  selected?: boolean
  onToggle: (selected: boolean) => void
}

// styles
const NoteCard = styled.li<{ $important?: boolean; $selected?: boolean }>`
  display: flex;
  height: ${({ theme }) => theme.sizes[72]};
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadiuses.xl};
  border: 1px solid ${({ theme, $selected }) => $selected && theme.colors.error};
  padding: ${({ theme }) => theme.spacing[4]};
`

const NoteCardHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const NoteCardTitle = styled.h3`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`

const NoteCardContent = styled.p`
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5;
  width: 100%;
  white-space: pre-wrap;
  font-size: ${({ theme }) => theme.fontSizes.sm};
`

const NoteCardFooter = styled.footer`
  display: flex;
  align-items: center;
`

const NoteCardImportantBadge = styled.span.attrs({
  role: "status",
})`
  border-radius: ${({ theme }) => theme.borderRadiuses.md};
  border: 1px solid ${({ theme }) => theme.colors.secondary};
  background-color: ${({ theme }) => theme.colors["secondary-light"]};
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[2]}`};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.secondary};
`

const StyledPencilSquareIcon = styled(PencilSquareIcon)`
  width: ${({ theme }) => theme.sizes[6]};
  height: ${({ theme }) => theme.sizes[6]};
`

const NoteBoardItem: React.FC<NoteBoardItemProps> = ({
  note,
  selected,
  onToggle,
}) => {
  return (
    <NoteCard $important={note.important} $selected={selected}>
      <NoteCardHeader>
        <NoteCardTitle>{note.title}</NoteCardTitle>
        <Checkbox
          checked={selected}
          onChange={onToggle}
          aria-label={`Toggle ${note.title}`}
        />
      </NoteCardHeader>
      <NoteCardContent>{note.content}</NoteCardContent>
      <Spacer />
      <NoteCardFooter>
        {note.important && (
          <NoteCardImportantBadge>Important</NoteCardImportantBadge>
        )}
        <Spacer />
        <Link to={`/note/${note.id}`} aria-label={`Edit ${note.title}`}>
          <StyledPencilSquareIcon />
        </Link>
      </NoteCardFooter>
    </NoteCard>
  )
}

export default NoteBoardItem
