import { FC, useEffect } from "react"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { useForm, Controller, SubmitHandler } from "react-hook-form"
import { Button } from "@headlessui/react"
import { AppDispatch } from "../../store"
import {
  Note,
  useAddNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} from "../../api"
import TextField from "../../components/form/TextField"
import TextareaField from "../../components/form/TextareaField"
import CheckboxField from "../../components/form/CheckboxField"
import { useAPIErrorHandler } from "../../hooks/useAPIErrorHandler"
import { showModal } from "../modals/modalSlice"
import { showMessage } from "../messages/messageSlice"

interface NoteFormProps {
  note?: Note
}

type NoteFormData = Pick<Note, "title"> & {
  content: string
  important: boolean
} // this shape describes the form, which always has the "content" and "important" fields

const NoteForm: FC<NoteFormProps> = ({ note }) => {
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

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

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
        title: "Delete note",
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
    <form onSubmit={handleSubmit(onSubmit)} aria-labelledby="page-title">
      <div className="flex flex-col gap-6">
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
          a native "onChange" handler (it can be used as uncontrolled, but this only means the component will track the
          state internally)
        */}
      </div>
      <div className="mt-6 flex items-center gap-4">
        {note && (
          <Button
            type="button"
            className="rounded-md bg-red-700 px-3 py-1.5 text-sm/6 font-semibold text-white data-[disabled]:bg-gray-500"
            onClick={() => deleteNote()}
            disabled={isSubmitting}
          >
            Delete
          </Button>
        )}
        <span className="flex-1"></span>
        <Link to="/" className="font-medium text-sky-700">
          Cancel
        </Link>
        <Button
          type="submit"
          className="rounded-md bg-sky-700 px-3 py-1.5 text-sm/6 font-semibold text-white data-[disabled]:bg-gray-500"
          disabled={isSubmitting}
        >
          {note ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  )
}

export default NoteForm
