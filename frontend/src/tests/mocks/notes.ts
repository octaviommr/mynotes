import { NoteResponse } from "../../features/notes/types/Note"

export const mockNoteList: NoteResponse[] = [
  {
    _id: "1",
    title: "Title 1",
    content: "Content 1",
    important: true,
  },
  {
    _id: "2",
    title: "Title 2",
    content: "Content 2",
    important: false,
  },
]
