import { FC } from "react"
import NoteForm from "./NoteForm"

const NewNote: FC = () => {
  return (
    <div className="flex h-full flex-col justify-center gap-10">
      <h2 id="page-title" className="text-center text-2xl font-bold">
        New Note
      </h2>
      <div className="mx-auto w-full max-w-sm">
        <NoteForm />
      </div>
    </div>
  )
}

export default NewNote
