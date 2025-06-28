import { http, HttpResponse } from "msw"
import { BASE_API_URL } from "../../../api/baseApi"
import { render, userEvent } from "../../../tests/__test-utils__/testUtils"
import { server } from "../../../tests/server"
import type { NoteResponse, Note } from "../types/Note"
import { mockNoteList } from "../__test-utils__/mocks"
import {
  editNote,
  fillInTitleField,
  fillInContentField,
  toggleImportantField,
  submitForm,
  expectNotes,
  expectMessage,
  expectNoteFormErrorMessage,
} from "../__test-utils__/testUtils"

// mocks
const mockUpdatedNote: NoteResponse = {
  _id: mockNoteList[0]._id,
  title: "Title 3",
  content: "Content 3",
  important: false,
}

const mockNoteEdition = () => {
  let currentMockNoteList = [...mockNoteList]

  server.use(
    // override the original request handler to keep an updated mock note list when notes are updated
    http.put<
      { id: string },
      Omit<Note, "id">,
      NoteResponse | { message: string },
      `${typeof BASE_API_URL}/notes/:id`
    >(`${BASE_API_URL}/notes/:id`, async ({ params: { id }, request }) => {
      const updatedNoteData = await request.json()

      if (id !== "1" && id !== "2") {
        // note not found
        return HttpResponse.json({ message: "" }, { status: 404 })
      }

      const updatedNote: NoteResponse = { _id: id, ...updatedNoteData }

      // update current mock note list
      currentMockNoteList = currentMockNoteList.map((note) =>
        note._id === id ? updatedNote : note,
      )

      return HttpResponse.json(updatedNote)
    }),

    // override the original request handler to return the current mock note list
    http.get<never, never, NoteResponse[], `${typeof BASE_API_URL}/notes`>(
      `${BASE_API_URL}/notes`,
      () => {
        return HttpResponse.json(currentMockNoteList)
      },
    ),
  )
}

// tests
describe("Updating a note", () => {
  describe("when updating a note", () => {
    describe("when the form is valid", () => {
      beforeEach(() => {
        // mock
        mockNoteEdition()
      })

      it("displays the updated note on the note board page", async () => {
        const user = userEvent.setup()

        // arrange
        render()

        // act
        await editNote(user, mockNoteList[0])
        await fillInTitleField(user, mockUpdatedNote.title)
        await fillInContentField(user, mockUpdatedNote.content!)
        await toggleImportantField(user)
        await submitForm(user, "edition")

        // assert
        await expectNotes([mockUpdatedNote, mockNoteList[1]])
      })

      it("displays a note edition success message", async () => {
        const user = userEvent.setup()

        // arrange
        render()

        // act
        await editNote(user, mockNoteList[0])
        await fillInTitleField(user, mockUpdatedNote.title)
        await fillInContentField(user, mockUpdatedNote.content!)
        await toggleImportantField(user)
        await submitForm(user, "edition")

        // assert
        await expectMessage("Note updated successfully!")
      })
    })

    describe("when the form is not valid", () => {
      it("displays an error message when the required title field is empty", async () => {
        const user = userEvent.setup()

        // arrange
        render()

        // act
        await editNote(user, mockNoteList[0])
        await fillInTitleField(user, "")
        await submitForm(user, "edition")

        // assert
        expectNoteFormErrorMessage()
      })
    })
  })
})
