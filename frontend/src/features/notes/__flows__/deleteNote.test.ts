import { http, HttpResponse } from "msw"
import { BASE_API_URL } from "../../../api/baseApi"
import {
  render,
  screen,
  userEvent,
  type UserEvent,
} from "../../../tests/__test-utils__/testUtils"
import { server } from "../../../tests/server"
import type { NoteResponse } from "../types/Note"
import { mockNoteList } from "../__test-utils__/mocks"
import {
  confirmNoteDeletion,
  cancelNoteDeletion,
  expectNotes,
  expectNoteDeletionAlert,
  expectMessage,
  expectNoNoteDeletionAlert,
  expectLocation,
  editNote,
} from "../__test-utils__/testUtils"

// mocks
const mockNoteDeletion = () => {
  let currentMockNoteList = [...mockNoteList]

  server.use(
    // override the original request handler to keep an updated mock note list when notes are deleted
    http.delete<
      { id: string },
      never,
      never,
      `${typeof BASE_API_URL}/notes/:id`
    >(`${BASE_API_URL}/notes/:id`, ({ params: { id } }) => {
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

// actions
const deleteNote = async (user: UserEvent) => {
  const deleteButton = await screen.findByRole("button", { name: "Delete" })
  await user.click(deleteButton)
}

// tests
describe("Deleting a note", () => {
  describe("when deleting a note", () => {
    it("displays a confirmation alert", async () => {
      const user = userEvent.setup()

      // arrange
      render()

      // act
      await editNote(user, mockNoteList[0])
      await deleteNote(user)

      // assert
      expectNoteDeletionAlert(
        "Delete Note",
        "Are you sure you want to delete the note?",
      )
    })

    describe("when the user confirms the note deletion", () => {
      beforeEach(() => {
        // mock
        mockNoteDeletion()
      })

      it("displays the note board page without the deleted note", async () => {
        const user = userEvent.setup()

        // arrange
        render()

        // act
        await editNote(user, mockNoteList[0])
        await deleteNote(user)
        await confirmNoteDeletion(user)

        // assert
        await expectNotes([mockNoteList[1]])
      })

      it("displays a note deletion success message", async () => {
        const user = userEvent.setup()

        // arrange
        render()

        // act
        await editNote(user, mockNoteList[0])
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
        render()

        // act
        await editNote(user, mockNoteList[0])
        await deleteNote(user)
        await cancelNoteDeletion(user)

        // assert
        expectNoNoteDeletionAlert()
      })

      it("stays in the note edition page", async () => {
        const user = userEvent.setup()

        // arrange
        render()

        // act
        await editNote(user, mockNoteList[0])
        await deleteNote(user)
        await cancelNoteDeletion(user)

        // assert
        expectLocation(`/note/${mockNoteList[0]._id}`)
      })
    })
  })
})
