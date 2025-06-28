import { http, HttpResponse } from "msw"
import { BASE_API_URL } from "../../../api/baseApi"
import { render, userEvent } from "../../../tests/__test-utils__/testUtils"
import { server } from "../../../tests/server"
import type { NoteResponse, Note } from "../types/Note"
import { mockNoteList } from "../__test-utils__/mocks"
import {
  addNote,
  fillInTitleField,
  fillInContentField,
  toggleImportantField,
  submitForm,
  expectNotes,
  expectMessage,
  expectNoteFormErrorMessage,
} from "../__test-utils__/testUtils"

// mocks
const mockNewNote: NoteResponse = {
  _id: "3",
  title: "Title 3",
  content: "Content 3",
  important: true,
}

const mockNoteCreation = () => {
  let currentMockNoteList = [...mockNoteList]

  server.use(
    // override the original request handler to keep an updated mock note list when notes are created
    http.post<
      never,
      Omit<Note, "id">,
      NoteResponse,
      `${typeof BASE_API_URL}/notes`
    >(`${BASE_API_URL}/notes`, async ({ request }) => {
      const newNoteData = await request.json()

      const createdNote: NoteResponse = {
        _id: `${currentMockNoteList.length + 1}`,
        ...newNoteData,
      }

      // update current mock note list
      currentMockNoteList = [...currentMockNoteList, createdNote]

      return HttpResponse.json(createdNote)
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
describe("Adding a note", () => {
  describe("when adding a new note", () => {
    describe("when the form is valid", () => {
      beforeEach(() => {
        // mock
        mockNoteCreation()
      })

      it("displays the new note on the note board", async () => {
        const user = userEvent.setup()

        // arrange
        render()

        // act
        await addNote(user)
        await fillInTitleField(user, mockNewNote.title)
        await fillInContentField(user, mockNewNote.content!)
        await toggleImportantField(user)
        await submitForm(user, "creation")

        // assert
        await expectNotes([...mockNoteList, mockNewNote])
      })

      it("displays a note creation success message", async () => {
        const user = userEvent.setup()

        // arrange
        render()

        // act
        await addNote(user)
        await fillInTitleField(user, mockNewNote.title)
        await fillInContentField(user, mockNewNote.content!)
        await toggleImportantField(user)
        await submitForm(user, "creation")

        // assert
        await expectMessage("Note created successfully!")
      })
    })

    describe("when the form is not valid", () => {
      it("displays an error message when the required title field is empty", async () => {
        const user = userEvent.setup()

        // arrange
        render()

        // act
        await addNote(user)
        await fillInTitleField(user, "")
        await fillInContentField(user, mockNewNote.content!)
        await toggleImportantField(user)
        await submitForm(user, "creation")

        // assert
        expectNoteFormErrorMessage()
      })
    })
  })
})
