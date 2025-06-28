import { http, HttpResponse } from "msw"
import { BASE_API_URL } from "../../../api/baseApi"
import type { NoteResponse } from "../types/Note"
import { mockNoteList } from "./mocks"

export const handlers = [
  http.get<never, never, NoteResponse[], `${typeof BASE_API_URL}/notes`>(
    `${BASE_API_URL}/notes`,
    () => {
      return HttpResponse.json(mockNoteList)
    },
  ),

  http.get<
    { id: string },
    never,
    NoteResponse,
    `${typeof BASE_API_URL}/notes/:id`
  >(`${BASE_API_URL}/notes/:id`, ({ params: { id } }) => {
    return HttpResponse.json({
      _id: id,
      title: `Title ${id}`,
      content: `Content ${id}`,
      important: true,
    })
  }),
]
