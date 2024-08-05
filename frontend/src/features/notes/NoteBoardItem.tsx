import { FC } from "react"
import { Link } from "react-router-dom"
import { Checkbox } from "@headlessui/react"
import { CheckIcon } from "@heroicons/react/16/solid"
import { Note } from "../../api"

interface NoteBoardItemProps {
  note: Note
  selected: boolean
  onToggle: (selected: boolean) => void
}

const NoteBoardItem: FC<NoteBoardItemProps> = ({
  note,
  selected,
  onToggle,
}) => {
  // set up a data attribute to be able to conditionally apply styling when the note is selected
  const dataAttrs = { ...(selected && { "data-selected": true }) }

  return (
    <Link
      to={`/note/${note.id}`}
      className="flex h-72 flex-col items-start gap-4 rounded-xl border border-gray-300 p-4 hover:border-gray-700 data-[selected]:border-red-700"
      {...dataAttrs}
    >
      <div className="flex w-full items-center gap-4">
        <h3 className="flex-1 truncate text-lg font-bold">{note.title}</h3>
        <Checkbox
          checked={selected}
          onChange={onToggle}
          className="group size-6 rounded-md bg-white p-1 ring-1 ring-inset ring-gray-300 hover:cursor-default data-[checked]:bg-red-700 data-[checked]:ring-red-300"
        >
          <CheckIcon className="hidden size-4 fill-white group-data-[checked]:block" />
        </Checkbox>
      </div>
      <p className="line-clamp-5 w-full whitespace-pre-wrap text-sm/6 text-slate-700">
        {note.content}
      </p>
      <span className="flex-1"></span>
      {note.important && (
        <span className="rounded-md border border-red-300 bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
          Important
        </span>
      )}
    </Link>
  )
}

export default NoteBoardItem
