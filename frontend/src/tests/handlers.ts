import { http, HttpResponse } from "msw"
import type { NoteResponse, Note } from "../features/notes/types/Note"
import { mockNoteList } from "./mocks/notes"

export const BASE_API_URL = process.env.REACT_APP_API_URL

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
  http.post<
    never,
    { ids: string[] },
    { deletedIds: string[] },
    `${typeof BASE_API_URL}/notes/deleteBatch`
  >(`${BASE_API_URL}/notes/deleteBatch`, async ({ request }) => {
    const { ids } = await request.json()

    return HttpResponse.json({ deletedIds: ids })
  }),
  http.post<
    never,
    Omit<Note, "id">,
    NoteResponse,
    `${typeof BASE_API_URL}/notes`
  >(`${BASE_API_URL}/notes`, async ({ request }) => {
    const newNoteData = await request.json()

    return HttpResponse.json({ _id: "3", ...newNoteData })
  }),
  http.put<
    { id: string },
    Omit<Note, "id">,
    NoteResponse,
    `${typeof BASE_API_URL}/notes/:id`
  >(`${BASE_API_URL}/notes/:id`, async ({ params: { id }, request }) => {
    const updatedNoteData = await request.json()

    return HttpResponse.json({ _id: id, ...updatedNoteData })
  }),
  http.delete<{ id: string }, never, never, `${typeof BASE_API_URL}/notes/:id`>(
    `${BASE_API_URL}/notes/:id`,
    () => {
      return new HttpResponse(null, { status: 204 })
    },
  ),
]
