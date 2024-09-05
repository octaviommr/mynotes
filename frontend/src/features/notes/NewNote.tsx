import { FC, useEffect } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { SubmitHandler } from "react-hook-form"
import { AppDispatch } from "../../store"
import { useAddNoteMutation } from "../../api"
import { useAPIErrorHandler } from "../../hooks/useAPIErrorHandler"
import { showMessage } from "../messages/messageSlice"
import NoteForm, { NoteFormData } from "./NoteForm"

const NewNote: FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const [addNote, { error, isSuccess }] = useAddNoteMutation()
  const handle = useAPIErrorHandler()

  const onSubmit: SubmitHandler<NoteFormData> = async (data) => {
    const { title, content, important } = data

    await addNote({ title, content, important })
  }

  // handle mutation results
  useEffect(() => {
    if (isSuccess) {
      // redirect back to the homepage
      navigate("/")

      // show a success message
      dispatch(
        showMessage({
          severity: "success",
          content: `Note created successfully!`,
        }),
      )

      return
    }

    if (error) {
      // creation failed so let's handle the error
      handle(error)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, error])

  return <NoteForm mode="creation" onSubmit={onSubmit} cancelURL="/" />
}

export default NewNote
