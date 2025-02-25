import userEvent, { UserEvent } from "@testing-library/user-event"
import { http, HttpResponse } from "msw"
import { render, screen } from "../../../testUtils"
import {
  confirmNoteDeletion,
  cancelNoteDeletion,
  fillInTitleField,
  fillInContentField,
  toggleImportantField,
  submitForm,
  expectNoteForm,
  expectNoteFormDefaultValues,
  expectNotes,
  expectNoteDeletionAlert,
  expectMessage,
  expectNoNoteDeletionAlert,
  expectLocation,
} from "./utils"
import { mockNoteList } from "../../../mocks/handlers"
import { server } from "../../../mocks/node"
import { BASE_URL, NoteResponse, Note } from "../../../api"

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
      `${typeof BASE_URL}/notes/:id`
    >(`${BASE_URL}/notes/:id`, async ({ params: { id }, request }) => {
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
    http.get<never, never, NoteResponse[], `${typeof BASE_URL}/notes`>(
      `${BASE_URL}/notes`,
      () => {
        return HttpResponse.json(currentMockNoteList)
      },
    ),
  )
}

const mockNoteDeletion = () => {
  let currentMockNoteList = [...mockNoteList]

  server.use(
    // override the original request handler to keep an updated mock note list when notes are deleted
    http.delete<{ id: string }, never, never, `${typeof BASE_URL}/notes/:id`>(
      `${BASE_URL}/notes/:id`,
      ({ params: { id } }) => {
        const updatedMockNoteList = currentMockNoteList.filter(
          (note) => note._id !== id,
        )

        if (updatedMockNoteList.length === currentMockNoteList.length) {
          // note not found
          return HttpResponse.json({ message: "" }, { status: 404 })
        }

        // update current mock note list
        currentMockNoteList = [...updatedMockNoteList]

        return new HttpResponse(null, { status: 204 })
      },
    ),

    // override the original request handler to return the current mock note list
    http.get<never, never, NoteResponse[], `${typeof BASE_URL}/notes`>(
      `${BASE_URL}/notes`,
      () => {
        return HttpResponse.json(currentMockNoteList)
      },
    ),
  )
}

// actions
const deleteNote = async (user: UserEvent) => {
  const deleteButton = await screen.findByRole("button", { name: "Delete" })
  await user.click(deleteButton)
}

// tests
describe("NoteDetail component", () => {
  describe("when navigating to the note edition page", () => {
    it("displays the note edition form", async () => {
      // arrange
      render(`/note/${mockNoteList[0]._id}`)

      // assert
      await expectNoteForm("edition")
    })

    it("displays default values for all fields, matching the note data", async () => {
      // arrange
      render(`/note/${mockNoteList[0]._id}`)

      // assert
      await expectNoteFormDefaultValues(mockNoteList[0])
    })
  })

  describe("when updating a note", () => {
    describe("when the form is valid", () => {
      it("displays the updated note on the note board page", async () => {
        const user = userEvent.setup()

        // mock
        mockNoteEdition()

        // arrange
        render(`/note/${mockNoteList[0]._id}`)

        // act
        await fillInTitleField(user, mockUpdatedNote.title)
        await fillInContentField(user, mockUpdatedNote.content!)
        await toggleImportantField(user)
        await submitForm(user, "edition")

        // assert
        await expectNotes([mockUpdatedNote, mockNoteList[1]])
      })

      it("displays a note edition success message", async () => {
        const user = userEvent.setup()

        // mock
        mockNoteEdition()

        // arrange
        render(`/note/${mockNoteList[0]._id}`)

        // act
        await fillInTitleField(user, mockUpdatedNote.title)
        await fillInContentField(user, mockUpdatedNote.content!)
        await toggleImportantField(user)
        await submitForm(user, "edition")

        // assert
        await expectMessage("Note updated successfully!")
      })
    })
  })

  describe("when deleting a note", () => {
    it("displays a confirmation alert", async () => {
      const user = userEvent.setup()

      // arrange
      render(`/note/${mockNoteList[0]._id}`)

      // act
      await deleteNote(user)

      // assert
      expectNoteDeletionAlert(
        "Delete note",
        "Are you sure you want to delete the note?",
      )
    })

    describe("when the user confirms the note deletion", () => {
      it("displays the note board page without the deleted note", async () => {
        const user = userEvent.setup()

        // mock
        mockNoteDeletion()

        // arrange
        render(`/note/${mockNoteList[0]._id}`)

        // act
        await deleteNote(user)
        await confirmNoteDeletion(user)

        // assert
        await expectNotes([mockNoteList[1]])
      })

      it("displays a note deletion success message", async () => {
        const user = userEvent.setup()

        // mock
        mockNoteDeletion()

        // arrange
        render(`/note/${mockNoteList[0]._id}`)

        // act
        await deleteNote(user)
        await confirmNoteDeletion(user)

        // assert
        await expectMessage("Note deleted successfully!")
      })
    })

    describe("when the user cancels the note deletion", () => {
      it("closes the confirmation alert", async () => {
        const user = userEvent.setup()

        // arrange
        render(`/note/${mockNoteList[0]._id}`)

        // act
        await deleteNote(user)
        await cancelNoteDeletion(user)

        // assert
        expectNoNoteDeletionAlert()
      })

      it("stays in the note edition page", async () => {
        const user = userEvent.setup()

        // arrange
        render(`/note/${mockNoteList[0]._id}`)

        // act
        await deleteNote(user)
        await cancelNoteDeletion(user)

        // assert
        expectLocation(`/note/${mockNoteList[0]._id}`)
      })
    })
  })
})
