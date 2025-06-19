import { FC } from "react"
import FormContainer from "../../components/form/FormContainer"
import PageTitle from "../../components/PageTitle"
import NoteForm from "./NoteForm"

const NewNote: FC = () => {
  return (
    <FormContainer>
      <PageTitle id="page-title">New Note</PageTitle>
      <NoteForm />
    </FormContainer>
  )
}

export default NewNote
