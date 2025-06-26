import { FC } from "react"
import FormContainer from "../../../components/ui/containers/FormContainer"
import PageTitle from "../../../components/ui/PageTitle"
import NoteForm from "../components/NoteForm"

const NewNote: FC = () => {
  return (
    <FormContainer>
      <PageTitle id="page-title">New Note</PageTitle>
      <NoteForm />
    </FormContainer>
  )
}

export default NewNote
