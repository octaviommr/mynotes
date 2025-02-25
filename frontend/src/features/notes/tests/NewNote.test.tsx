import userEvent from "@testing-library/user-event"
import { http, HttpResponse } from "msw"
import { render } from "../../../testUtils"
import {
  fillInTitleField,
  fillInContentField,
  toggleImportantField,
  submitForm,
  expectNoteForm,
  expectNoteFormDefaultValues,
  expectNotes,
  expectMessage,
  expectNoteFormErrorMessage,
} from "./utils"
import { mockNoteList } from "../../../mocks/handlers"
import { server } from "../../../mocks/node"
import { BASE_URL, NoteResponse, Note } from "../../../api"

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
      `${typeof BASE_URL}/notes`
    >(`${BASE_URL}/notes`, async ({ request }) => {
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
    http.get<never, never, NoteResponse[], `${typeof BASE_URL}/notes`>(
      `${BASE_URL}/notes`,
      () => {
        return HttpResponse.json(currentMockNoteList)
      },
    ),
  )
}

// tests
describe("NewNote component", () => {
  describe("when navigating to the note creation page", () => {
    it("displays the note creation form", async () => {
      // arrange
      render("/note/create")

      // assert
      await expectNoteForm("creation")
    })

    it("displays default values for all fields", async () => {
      // arrange
      render("/note/create")

      // assert
      await expectNoteFormDefaultValues()
    })
  })

  describe("when creating a new note", () => {
    describe("when the form is valid", () => {
      it("displays the new note on the note board page", async () => {
        const user = userEvent.setup()

        // mock
        mockNoteCreation()

        // arrange
        render("/note/create")

        // act
        await fillInTitleField(user, mockNewNote.title)
        await fillInContentField(user, mockNewNote.content!)
        await toggleImportantField(user)
        await submitForm(user, "creation")

        // assert
        await expectNotes([...mockNoteList, mockNewNote])
      })

      it("displays a note creation success message", async () => {
        const user = userEvent.setup()

        // mock
        mockNoteCreation()

        // arrange
        render("/note/create")

        // act
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
        render("/note/create")

        // act
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
