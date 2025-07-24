import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useGetNoteQuery } from "../notesApi"
import { useAPIErrorHandler } from "../../../hooks/useAPIErrorHandler"
import PageTitle from "../../../components/ui/pages/PageTitle"
import {
  NotePageContainer,
  NoteFormContainer,
} from "../components/NotePage.styles"
import NoteForm from "../components/NoteForm"

const NOTE_DETAIL_TITLE_ID = "note-detail-title"

const NoteDetail: React.FC = () => {
  const [skipQuery, setSkipQuery] = useState(false)

  const { id } = useParams()

  const navigate = useNavigate()

  /*
    Set up the query to get the note data, making sure it doesn't automatically refetch (after mount) as a consequence of
    the note being updated or deleted.
    
    This configuration avoids unnecessary API calls (since we'll redirect back to the homepage anyway) and prevents us from
    getting a 404 error when a note is deleted (since we'd be trying to get a note that no longer exists).
  */
  const { data: note, error } = useGetNoteQuery(id!, {
    skip: skipQuery,
  })

  const handle = useAPIErrorHandler()

  // handle query errors and make sure it doesn't automatically refetch when the note is updated or deleted
  useEffect(() => {
    if (note) {
      setSkipQuery(true)
    }

    if (error) {
      handle(error)

      /*
        Narrow the type of the error to check if it's specifically a "FetchBaseQueryError", which represents an error 
        response returned from the API.
        
        In this particular case, redirect back to the homepage if the note doesn't exist or the user doesn't have access to
        it.
      */
      if (
        "status" in error &&
        typeof error.status === "number" &&
        [404, 403].includes(error.status)
      ) {
        navigate("/")
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note, error])

  if (!note) {
    return null
  }

  return (
    <NotePageContainer>
      <PageTitle id={NOTE_DETAIL_TITLE_ID}>Edit Note</PageTitle>
      <NoteFormContainer>
        <NoteForm note={note} labelElementId={NOTE_DETAIL_TITLE_ID} />
      </NoteFormContainer>
    </NotePageContainer>
  )
}

export default NoteDetail
