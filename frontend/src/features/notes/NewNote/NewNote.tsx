import PageTitle from "../../../components/ui/pages/PageTitle"
import {
  NotePageContainer,
  NoteFormContainer,
} from "../components/NotePage.styles"
import NoteForm from "../components/NoteForm"

const NEW_NOTE_TITLE_ID = "new-note-title"

const NewNote: React.FC = () => {
  return (
    <NotePageContainer>
      <PageTitle id={NEW_NOTE_TITLE_ID}>New Note</PageTitle>
      <NoteFormContainer>
        <NoteForm aria-labelledby={NEW_NOTE_TITLE_ID} />
      </NoteFormContainer>
    </NotePageContainer>
  )
}

export default NewNote
