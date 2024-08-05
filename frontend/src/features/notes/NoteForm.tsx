import { FC } from "react"
import { Link } from "react-router-dom"
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { Button } from "@headlessui/react"
import { Note } from "../../api"
import InputField from "../../components/form/InputField"
import TextareaField from "../../components/form/TextareaField"
import SwitchField from "../../components/form/SwitchField"
import { useModal } from "../../hooks/useModal"

export interface NoteFormData {
  title: string
  content: string
  important: boolean
}

// set up a discriminated union to represent the valid sets of props
type NoteFormProps =
  | {
      mode: "edition"
      note: Note
      onDelete: () => void
      onSubmit: SubmitHandler<NoteFormData>
      cancelURL: string
    }
  | {
      mode: "creation"
      onSubmit: SubmitHandler<NoteFormData>
      cancelURL: string
    }

const NoteForm: FC<NoteFormProps> = (props) => {
  // set up a quick way to narrow the type of the props when needed
  const isNewNote = props.mode === "creation"

  const {
    register,
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<NoteFormData>({
    defaultValues: {
      title: isNewNote ? "" : props.note.title,
      content: isNewNote ? "" : props.note.content,
      important: isNewNote ? false : props.note.important,
    },
  })

  const showModal = useModal()

  const deleteNote = () => {
    if (isNewNote) {
      return
    }

    showModal(
      {
        type: "alert",
        title: "Delete note",
        content: "Are you sure you want to delete the note?",
        okLabel: "Delete",
        cancelLabel: "Cancel",
      },
      (result) => {
        if (result) {
          props.onDelete()
        }
      },
    )
  }

  return (
    <div className="flex h-full flex-col justify-center gap-10">
      <h2 className="text-center text-2xl font-bold">
        {isNewNote ? "New note" : props.note.title}
      </h2>
      <div className="mx-auto w-full max-w-sm">
        <form onSubmit={handleSubmit(props.onSubmit)}>
          <div className="flex flex-col gap-6">
            <InputField
              {...register("title", {
                required: "Title is required.",
              })}
              label="Title"
              error={errors.title?.message}
            />
            <TextareaField {...register("content")} label="Content" rows={5} />

            {/*
              Switch fields are used as controlled components because, although Headless UI's "Switch" component can be used
              as uncontrolled, it doesn't expose a native checkbox input
            */}
            <Controller
              name="important"
              control={control}
              render={({ field: { value, onChange } }) => (
                <SwitchField
                  checked={value}
                  onChange={onChange}
                  label="Important"
                />
              )}
            />
          </div>
          <div className="mt-6 flex items-center gap-4">
            {!isNewNote && (
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
            <Link to={props.cancelURL} className="font-medium text-sky-700">
              Cancel
            </Link>
            <Button
              type="submit"
              className="rounded-md bg-sky-700 px-3 py-1.5 text-sm/6 font-semibold text-white data-[disabled]:bg-gray-500"
              disabled={isSubmitting}
            >
              {isNewNote ? "Create" : "Update"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NoteForm
