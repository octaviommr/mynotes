import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useForm, Controller, SubmitHandler } from "react-hook-form"
import styled from "styled-components"
import type { AppDispatch } from "../../../store/store"
import {
  useAddNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} from "../notesApi"
import type { Note } from "../types/Note"
import TextField from "../../../components/ui/fields/TextField"
import TextareaField from "../../../components/ui/fields/TextareaField"
import CheckboxField from "../../../components/ui/fields/CheckboxField"
import { useAPIErrorHandler } from "../../../hooks/useAPIErrorHandler"
import { showModal } from "../../../components/layout/modal/modalSlice"
import { showMessage } from "../../../components/layout/message/messageSlice"
import Button from "../../../components/ui/Button"
import Spacer from "../../../components/ui/Spacer"
import Link from "../../../components/ui/Link"

interface NoteFormProps {
  note?: Note
  labelElementId: string
}

type NoteFormData = Omit<Note, "id">

// styles
const FieldsContainer = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[8]};
`

const ActionsContainer = styled.section`
  margin-top: ${({ theme }) => theme.spacing[8]};
  padding-top: ${({ theme }) => theme.spacing[4]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  border-top: 1px solid;
`

const NoteForm: React.FC<NoteFormProps> = ({ note, labelElementId }) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<NoteFormData>({
    defaultValues: {
      title: note?.title,
      content: note?.content,
      important: note?.important ?? false, // controlled components should always have a default value
    },
  })

  const [addNote, { error: addMutationError, isSuccess: isAddSuccess }] =
    useAddNoteMutation()

  const [
    updateNote,
    { error: updateMutationError, isSuccess: isUpdateSuccess },
  ] = useUpdateNoteMutation()

  const [
    runDeleteNoteMutation,
    { error: deleteMutationError, isSuccess: isDeleteSuccess },
  ] = useDeleteNoteMutation()

  const isMutationSuccess = isAddSuccess || isUpdateSuccess || isDeleteSuccess
  const mutationError =
    addMutationError || updateMutationError || deleteMutationError

  const handle = useAPIErrorHandler()

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  // handle mutation results
  useEffect(() => {
    if (isMutationSuccess) {
      // redirect back to the homepage
      navigate("/")

      // show a success message
      dispatch(
        showMessage({
          severity: "success",
          content: `Note ${isAddSuccess ? "created" : isUpdateSuccess ? "updated" : "deleted"} successfully!`,
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

  const onSubmit: SubmitHandler<NoteFormData> = async (data) => {
    await (!note ? addNote(data) : updateNote({ id: note.id, ...data }))
  }

  const deleteNote = async () => {
    if (!note) {
      return
    }

    const result = await dispatch(
      showModal({
        type: "alert",
        title: "Delete Note",
        content: "Are you sure you want to delete the note?",
        okLabel: "Delete",
        cancelLabel: "Cancel",
      }),
    )

    if (result) {
      runDeleteNoteMutation(note.id)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} aria-labelledby={labelElementId}>
      <FieldsContainer>
        <TextField
          {...register("title", {
            required: "Title is required.",
          })}
          label="Title"
          error={errors.title?.message}
          required
        />
        <TextareaField {...register("content")} label="Content" rows={5} />

        <Controller
          name="important"
          control={control}
          render={({ field: { value, onChange, name } }) => (
            <CheckboxField
              name={name}
              checked={value}
              onChange={onChange}
              label="Important"
            />
          )}
        />
        {/*
          NOTE: Checkbox fields are used as controlled components because Headless UI's "Checkbox" component doesn't expose
          a native "onChange" handler.
          
          The component can be used as uncontrolled, but this only means it will track the state internally.
        */}
      </FieldsContainer>
      <ActionsContainer>
        {note && (
          <Button
            onClick={() => deleteNote()}
            disabled={isSubmitting}
            $variant="error"
          >
            Delete
          </Button>
        )}
        <Spacer />
        <Link to="/">Cancel</Link>
        <Button type="submit" disabled={isSubmitting}>
          {note ? "Update" : "Create"}
        </Button>
      </ActionsContainer>
    </form>
  )
}

export default NoteForm
