import { http, HttpResponse } from "msw"
import { BASE_URL, NoteResponse, Note } from "../api"

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

export const handlers = [
  http.get<never, never, NoteResponse[], `${typeof BASE_URL}/notes`>(
    `${BASE_URL}/notes`,
    () => {
      return HttpResponse.json(mockNoteList)
    },
  ),
  http.get<{ id: string }, never, NoteResponse, `${typeof BASE_URL}/notes/:id`>(
    `${BASE_URL}/notes/:id`,
    ({ params: { id } }) => {
      return HttpResponse.json({
        _id: id,
        title: `Title ${id}`,
        content: `Content ${id}`,
        important: true,
      })
    },
  ),
  http.post<
    never,
    { ids: string[] },
    { deletedIds: string[] },
    `${typeof BASE_URL}/notes/deleteBatch`
  >(`${BASE_URL}/notes/deleteBatch`, async ({ request }) => {
    const { ids } = await request.json()

    return HttpResponse.json({ deletedIds: ids })
  }),
  http.post<never, Omit<Note, "id">, NoteResponse, `${typeof BASE_URL}/notes`>(
    `${BASE_URL}/notes`,
    async ({ request }) => {
      const newNoteData = await request.json()

      return HttpResponse.json({ _id: "3", ...newNoteData })
    },
  ),
  http.put<
    { id: string },
    Omit<Note, "id">,
    NoteResponse,
    `${typeof BASE_URL}/notes/:id`
  >(`${BASE_URL}/notes/:id`, async ({ params: { id }, request }) => {
    const updatedNoteData = await request.json()

    return HttpResponse.json({ _id: id, ...updatedNoteData })
  }),
  http.delete<{ id: string }, never, never, `${typeof BASE_URL}/notes/:id`>(
    `${BASE_URL}/notes/:id`,
    () => {
      return new HttpResponse(null, { status: 204 })
    },
  ),
]
