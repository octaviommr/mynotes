import userEvent, { UserEvent } from "@testing-library/user-event"
import { http, HttpResponse } from "msw"
import { render, screen, within } from "../../../testUtils"
import {
  confirmNoteDeletion,
  cancelNoteDeletion,
  fillInTitleField,
  fillInContentField,
  toggleImportantField,
  submitForm,
  cancelForm,
  expectNoteForm,
  expectNoteFormDefaultValues,
  expectNotes,
  expectNoteDeletionAlert,
  expectMessage,
  expectNoteFormErrorMessage,
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
  const form = await screen.findByRole("form", { name: "Edit Note" })
  await user.click(within(form).getByRole("button", { name: "Delete" }))
}

// tests
describe("displays the note edition form", () => {
  test("lands on the right page", async () => {
    // arrange
    render(`/note/${mockNoteList[0]._id}`)

    // assert
    await expectNoteForm(mockNoteList[0])
  })

  test("displays default values for all fields", async () => {
    // arrange
    render(`/note/${mockNoteList[0]._id}`)

    // assert
    await expectNoteFormDefaultValues(mockNoteList[0])
  })
})

describe("updates notes", () => {
  test("displays the updated note on the note board page and a success message when the form is valid", async () => {
    const user = userEvent.setup()

    // mock
    mockNoteEdition()

    // arrange
    render(`/note/${mockNoteList[0]._id}`)

    // act
    await fillInTitleField(user, mockUpdatedNote.title, mockNoteList[0])
    await fillInContentField(user, mockUpdatedNote.content!, mockNoteList[0])
    await toggleImportantField(user, mockNoteList[0])
    await submitForm(user, mockNoteList[0])

    // assert
    await expectNotes([mockUpdatedNote, mockNoteList[1]])
    expectMessage("Note updated successfully!")
  })

  test("displays an error message when the required title field is left empty", async () => {
    const user = userEvent.setup()

    // arrange
    render(`/note/${mockNoteList[0]._id}`)

    // act
    await fillInTitleField(user, "", mockNoteList[0])
    await fillInContentField(user, mockUpdatedNote.content!, mockNoteList[0])
    await toggleImportantField(user, mockNoteList[0])
    await submitForm(user, mockNoteList[0])

    // assert
    expectNoteFormErrorMessage(mockNoteList[0])
  })

  test("displays an unchanged list on the note board page when the user cancels the operation", async () => {
    const user = userEvent.setup()

    // mock
    mockNoteEdition()

    // arrange
    render(`/note/${mockNoteList[0]._id}`)

    // act
    await fillInTitleField(user, mockUpdatedNote.title, mockNoteList[0])
    await fillInContentField(user, mockUpdatedNote.content!, mockNoteList[0])
    await toggleImportantField(user, mockNoteList[0])
    await cancelForm(user, mockNoteList[0])

    // assert
    await expectNotes(mockNoteList)
  })
})

describe("deletes notes", () => {
  test("displays an alert when the user tries to delete the note", async () => {
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

  test("displays an updated list on the note board page and a success message when the user confirms the operation", async () => {
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
    expectMessage("Note deleted successfully!")
  })

  test("keep editing the note if the user cancels the operation", async () => {
    const user = userEvent.setup()

    // arrange
    render(`/note/${mockNoteList[0]._id}`)

    // act
    await deleteNote(user)
    await cancelNoteDeletion(user)

    // assert
    await expectNoteForm(mockNoteList[0])
  })
})
