import userEvent from "@testing-library/user-event"
import { http, HttpResponse } from "msw"
import { render, screen, within } from "../../../testUtils"
import {
  fillInTitleField,
  fillInContentField,
  toggleImportantField,
  submitForm,
  cancelForm,
  expectNoteForm,
  expectNotes,
  expectMessage,
} from "../testUtils"
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
  let createdNote: NoteResponse

  server.use(
    // override the original request handler to make sure we store the note that was created
    http.post<
      never,
      Omit<Note, "id">,
      NoteResponse,
      `${typeof BASE_URL}/notes`
    >(`${BASE_URL}/notes`, async ({ request }) => {
      const newNote = await request.json()

      createdNote = { _id: mockNewNote._id, ...newNote }

      return HttpResponse.json(createdNote)
    }),

    // override the original request handler to return an updated mock note list including the note that was created
    http.get<never, never, NoteResponse[], `${typeof BASE_URL}/notes`>(
      `${BASE_URL}/notes`,
      () => {
        const updatedMockNoteList = createdNote
          ? [...mockNoteList, createdNote]
          : mockNoteList

        return HttpResponse.json(updatedMockNoteList)
      },
    ),
  )
}

// assertions
const expectDefaultValues = () => {
  const form = screen.getByRole("form", { name: "New note" })
  expect(form).toHaveFormValues({
    title: "",
    content: "",
  })

  /* 
    Assert the value of the "Important" field individually because currently the feature that allows using Headless UI's
    "Checkbox" component with forms (by rendering a hidden input field in sync with the checkbox state) is not working 
    correctly. Once it is, we should be able to use "toHaveFormValues" to assert the value of the "Important" form control
    as well.
  */
  expect(
    within(form).getByRole("checkbox", { name: "Important" }),
  ).not.toBeChecked()
}

const expectErrorMessage = () => {
  expect(
    within(screen.getByRole("form", { name: "New note" })).getByRole("alert"),
  ).toHaveTextContent(new RegExp(`^Title is required.$`)) // match the whole content
}

// tests
describe("displays the note creation form", () => {
  test("lands on the right page", async () => {
    // arrange
    render("/note/create")

    // assert
    await expectNoteForm()
  })

  test("displays default values for all fields", () => {
    // arrange
    render("/note/create")

    // assert
    expectDefaultValues()
  })
})

describe("creates new notes", () => {
  test("displays an updated list on the note board page and a success message when the form is valid", async () => {
    const user = userEvent.setup()

    // mock
    mockNoteCreation()

    // arrange
    render("/note/create")

    // act
    await fillInTitleField(user, mockNewNote.title)
    await fillInContentField(user, mockNewNote.content)
    await toggleImportantField(user)
    await submitForm(user)

    // assert
    await expectNotes([...mockNoteList, mockNewNote])
    expectMessage("Note created successfully!")
  })

  test("displays an error message when the required title field is left empty", async () => {
    const user = userEvent.setup()

    // arrange
    render("/note/create")

    // act
    await fillInContentField(user, "Content 3")
    await toggleImportantField(user)
    await submitForm(user)

    // assert
    expectErrorMessage()
  })

  test("displays an unchanged list on the note board page when the user cancels the operation", async () => {
    const user = userEvent.setup()

    // mock
    mockNoteCreation()

    // arrange
    render("/note/create")

    // act
    await fillInTitleField(user, mockNewNote.title)
    await fillInContentField(user, mockNewNote.content)
    await toggleImportantField(user)
    await cancelForm(user)

    // assert
    await expectNotes(mockNoteList)
  })
})
