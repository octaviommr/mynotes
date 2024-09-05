import { FC, useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import { SubmitHandler } from "react-hook-form"
import { AppDispatch } from "../../store"
import {
  useDeleteNoteMutation,
  useGetNoteQuery,
  useUpdateNoteMutation,
} from "../../api"
import { useAPIErrorHandler } from "../../hooks/useAPIErrorHandler"
import { showMessage } from "../messages/messageSlice"
import NoteForm, { NoteFormData } from "./NoteForm"

const NoteDetail: FC = () => {
  const [skipQuery, setSkipQuery] = useState(false)

  const { id } = useParams()

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  /*
    Set up the query to get the note data, making sure it doesn't automatically refetch (after mount) as a consequence of
    the note being updated or deleted. This configuration avoids unnecessary API calls (since we'll redirect back to the
    homepage anyway) and prevents us from getting a 404 error when a note is deleted (since we'd be trying to get a note
    that no longer exists).
  */
  const { data: note, error: queryError } = useGetNoteQuery(id!, {
    skip: skipQuery,
  })

  const [
    updateNote,
    { error: updateMutationError, isSuccess: isUpdateSuccess },
  ] = useUpdateNoteMutation()
  const [
    deleteNote,
    { error: deleteMutationError, isSuccess: isDeleteSuccess },
  ] = useDeleteNoteMutation()
  const isMutationSuccess = isUpdateSuccess || isDeleteSuccess
  const mutationError = updateMutationError || deleteMutationError

  const handle = useAPIErrorHandler()

  const onSubmit: SubmitHandler<NoteFormData> = async (data) => {
    const { title, content, important } = data

    await updateNote({ id: id!, title, content, important })
  }

  // handle query errors and make sure it doesn't automatically refetch when the note is updated or deleted
  useEffect(() => {
    if (note) {
      setSkipQuery(true)
    }

    if (queryError) {
      handle(queryError)

      /*
        Narrow the type of the error to check if it's specifically a "FetchBaseQueryError" representing an error response
        returned from the API, and in this particular case, redirect back to the homepage if the note doesn't exist or the
        user doesn't have access to it.
      */
      if (
        "status" in queryError &&
        typeof queryError.status === "number" &&
        [404, 403].includes(queryError.status)
      ) {
        navigate("/")
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note, queryError])

  // handle mutation results
  useEffect(() => {
    if (isMutationSuccess) {
      // redirect back to the homepage
      navigate("/")

      // show a success message
      dispatch(
        showMessage({
          severity: "success",
          content: `Note ${isUpdateSuccess ? "updated" : "deleted"} successfully!`,
        }),
      )

      return
    }

    if (mutationError) {
      // update or delete operation failed so let's handle the error
      handle(mutationError)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMutationSuccess, mutationError])

  if (!note) {
    return null
  }

  return (
    <NoteForm
      mode="edition"
      note={note}
      onDelete={() => deleteNote(id!)}
      onSubmit={onSubmit}
      cancelURL="/"
    />
  )
}

export default NoteDetail
