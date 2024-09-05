import userEvent, { UserEvent } from "@testing-library/user-event"
import { http, HttpResponse } from "msw"
import { render, screen, waitFor, within } from "../../testUtils"
import { mockNoteList } from "../../mocks/handlers"
import { server } from "../../mocks/node"
import { BASE_URL, NoteResponse } from "../../api"

const CARD_NAME_REGEX = /^Edit\s+.*$/
const CARD_CHECKBOX_NAME_REGEX = /^Toggle\s+.*$/

// mocks
const mockCustomNoteList = (customMockNoteList: NoteResponse[]) => {
  server.use(
    // override the original request handler to return a custom mock note list
    http.get<never, never, NoteResponse[], `${typeof BASE_URL}/notes`>(
      `${BASE_URL}/notes`,
      () => {
        return HttpResponse.json(customMockNoteList)
      },
    ),
  )
}

// actions
const toggleNoteSelection = async (
  user: UserEvent,
  { title }: NoteResponse,
) => {
  const cardCheckbox = await screen.findByRole("checkbox", {
    name: `Toggle ${title}`,
  })
  await user.click(cardCheckbox)
}

const clearNoteSelection = async (user: UserEvent) => {
  const clearSelectionButton = screen.getByRole("button", {
    name: "Clear selection",
  })
  await user.click(clearSelectionButton)
}

const deleteSelectedNotes = async (user: UserEvent) => {
  const toolbar = screen.getByRole("toolbar")
  const deleteButton = within(toolbar).getByRole("button", {
    name: "Delete",
  })
  await user.click(deleteButton)
}

const confirmNoteDeletion = async (user: UserEvent) => {
  const alert = screen.getByRole("alertdialog")
  const deleteButton = within(alert).getByRole("button", {
    name: "Delete",
  })
  await user.click(deleteButton)
}

const cancelNoteDeletion = async (user: UserEvent) => {
  const alert = screen.getByRole("alertdialog")
  const cancelButton = within(alert).getByRole("button", {
    name: "Cancel",
  })
  await user.click(cancelButton)
}

const addNote = async (user: UserEvent, isEmptyState = false) => {
  const addLink = await screen.findByRole("link", {
    name: isEmptyState ? "Add one" : "Add",
  })
  await user.click(addLink)
}

const editNote = async (user: UserEvent, { title }: NoteResponse) => {
  const card = await screen.findByRole("link", {
    name: `Edit ${title}`,
  })
  await user.click(card)
}

// assertions
const expectNote = (
  card: HTMLElement,
  { title, content, important }: NoteResponse,
) => {
  expect(card).toHaveAccessibleName(`Edit ${title}`)

  const cardTitle = within(card).getByRole("heading", {
    name: title,
  })
  expect(cardTitle).toBeInTheDocument()

  const cardCheckbox = within(card).getByRole("checkbox", {
    name: `Toggle ${title}`,
  })
  expect(cardCheckbox).not.toBeChecked()

  const cardContent = within(card).getByRole("paragraph")
  expect(cardContent).toHaveTextContent(new RegExp(`^${content}$`)) // match the whole content

  if (important) {
    const cardImportantBadge = within(card).getByRole("status")
    expect(cardImportantBadge).toHaveTextContent("Important")
  } else {
    const cardImportantBadge = within(card).queryByRole("status")
    expect(cardImportantBadge).not.toBeInTheDocument()
  }
}

const expectNotes = async (mockNotes: NoteResponse[]) => {
  const cards = await screen.findAllByRole("link", { name: CARD_NAME_REGEX })
  expect(cards).toHaveLength(mockNotes.length)

  for (let i = 0; i < mockNotes.length; i++) {
    expectNote(cards[i], mockNotes[i])
  }
}

const expectEmptyState = async () => {
  const message = await screen.findByText("No notes yet.")
  expect(message).toBeInTheDocument()

  const addLink = screen.getByRole("link", { name: "Add one" })
  expect(addLink).toBeInTheDocument()
}

const expectToolbar = (context: "default" | "selection") => {
  const toolbar = screen.getByRole("toolbar")
  expect(toolbar).toBeInTheDocument()

  if (context === "default") {
    const addLink = within(toolbar).getByRole("link", { name: "Add" })
    expect(addLink).toBeInTheDocument()
  } else {
    const deleteButton = within(toolbar).getByRole("button", {
      name: "Delete",
    })
    expect(deleteButton).toBeInTheDocument()

    const clearSelectionButton = within(toolbar).getByRole("button", {
      name: "Clear selection",
    })
    expect(clearSelectionButton).toBeInTheDocument()

    const selectedNotesCounter = within(toolbar).getByRole("status")
    expect(selectedNotesCounter).toHaveTextContent(new RegExp("^1$")) // match the whole content
  }
}

const expectSelectedNotesCount = (count: number) => {
  const toolbar = screen.getByRole("toolbar")
  const selectedNotesCounter = within(toolbar).getByRole("status")
  expect(selectedNotesCounter).toHaveTextContent(new RegExp(`^${count}$`))
}

const expectUnselectedNotes = () => {
  const cardCheckboxes = screen.getAllByRole("checkbox", {
    name: CARD_CHECKBOX_NAME_REGEX,
  })

  for (let i = 0; i < cardCheckboxes.length; i++) {
    expect(cardCheckboxes[i]).not.toBeChecked()
  }
}

const expectNoteDeletionAlert = () => {
  const alert = screen.getByRole("alertdialog")
  expect(alert).toBeInTheDocument()

  const alertTitle = within(alert).getByRole("heading", {
    name: "Delete notes",
  })
  expect(alertTitle).toBeInTheDocument()

  const alertContent = within(alert).getByRole("paragraph")
  expect(alertContent).toHaveTextContent(
    /^Are you sure you want to delete the selected notes\?$/,
  ) // match the whole content

  const cancelButton = within(alert).getByRole("button", { name: "Cancel" })
  expect(cancelButton).toBeInTheDocument()

  const deleteButton = within(alert).getByRole("button", { name: "Delete" })
  expect(deleteButton).toBeInTheDocument()
}

const expectUpdatedNotes = async (mockUpdatedNotes: NoteResponse[]) => {
  await waitFor(() => {
    // wait until list is updated
    const updatedCards = screen.getAllByRole("link", {
      name: CARD_NAME_REGEX,
    })
    expect(updatedCards).toHaveLength(mockUpdatedNotes.length)

    for (let i = 0; i < mockUpdatedNotes.length; i++) {
      expectNote(updatedCards[i], mockUpdatedNotes[i])
    }
  })
}

const expectMessage = (message: string) => {
  const alert = screen.getByRole("alert")
  expect(alert).toBeInTheDocument()

  const alertContent = within(alert).getByRole("paragraph")
  expect(alertContent).toHaveTextContent(new RegExp(`^${message}$`)) // match the whole content
}

const expectNoUpdatedNotes = async (mockUpdatedNotes: NoteResponse[]) => {
  await expect(
    waitFor(() => {
      const updatedCards = screen.getAllByRole("link", {
        name: CARD_NAME_REGEX,
      })
      expect(updatedCards).toHaveLength(mockUpdatedNotes.length)
    }),
  ).rejects.toThrow() // expect the list to never be updated and so "waitFor" to time out
}

const expectNoMessage = () => {
  const alert = screen.queryByRole("alert")
  expect(alert).not.toBeInTheDocument() // no message should be displayed
}

const expectSelectedNote = ({ title }: NoteResponse) => {
  const cardCheckbox = screen.getByRole("checkbox", {
    name: `Toggle ${title}`,
  })
  expect(cardCheckbox).toBeChecked()
}

const expectNoteForm = (mockNote?: NoteResponse) => {
  const pageTitle = screen.getByRole("heading", {
    name: mockNote ? mockNote.title : "New note",
  })
  expect(pageTitle).toBeInTheDocument()
}

// tests
describe("loads and lists notes", () => {
  test("displays cards for all existing notes, as well as the default toolbar", async () => {
    // arrange
    render()

    // assert
    await expectNotes(mockNoteList)
    expectToolbar("default")
  })

  test("displays empty state when there are no notes", async () => {
    // mock
    mockCustomNoteList([])

    // arrange
    render()

    // assert
    await expectEmptyState()
  })
})

describe("allows note selection", () => {
  test("displays the selection toolbar when the user selects a note", async () => {
    const user = userEvent.setup()

    // arrange
    render()

    // act
    await toggleNoteSelection(user, mockNoteList[0])

    // assert
    expectToolbar("selection")
  })

  test("displays the updated selection count as the user selects and unselects notes", async () => {
    const user = userEvent.setup()

    // arrange
    render()

    // act
    await toggleNoteSelection(user, mockNoteList[0])
    await toggleNoteSelection(user, mockNoteList[1])

    // assert
    expectSelectedNotesCount(2)

    // act
    await toggleNoteSelection(user, mockNoteList[1])

    // assert
    expectSelectedNotesCount(1)
  })

  test("reverts to the default toolbar when the user unselects all notes", async () => {
    const user = userEvent.setup()

    // arrange
    render()

    // act
    await toggleNoteSelection(user, mockNoteList[0])
    await toggleNoteSelection(user, mockNoteList[0])

    // assert
    expectToolbar("default")
  })

  test("clears note selection and reverts to the default toolbar when the user clicks the cross button in the selection toolbar", async () => {
    const user = userEvent.setup()

    // arrange
    render()

    // act
    await toggleNoteSelection(user, mockNoteList[0])
    await toggleNoteSelection(user, mockNoteList[1])
    await clearNoteSelection(user)

    // assert
    expectUnselectedNotes()
    expectToolbar("default")
  })
})

describe("deletes selected notes", () => {
  test("displays an alert when the user tries to delete the selected notes", async () => {
    const user = userEvent.setup()

    // arrange
    render()

    // act
    await toggleNoteSelection(user, mockNoteList[0])
    await deleteSelectedNotes(user)

    // assert
    expectNoteDeletionAlert()
  })

  test("if the user confirms the operation, displays the updated list, a success message, and reverts to the default toolbar", async () => {
    const user = userEvent.setup()

    // arrange
    render()

    // act
    await toggleNoteSelection(user, mockNoteList[0])

    // mock
    mockCustomNoteList([mockNoteList[1]])

    // act
    await deleteSelectedNotes(user)
    await confirmNoteDeletion(user)

    // assert
    await expectUpdatedNotes([mockNoteList[1]])
    expectMessage("Notes deleted successfully!")
    expectToolbar("default")
  })

  test("does nothing if the user cancels the operation", async () => {
    const user = userEvent.setup()

    // arrange
    render()

    // act
    await toggleNoteSelection(user, mockNoteList[0])
    await deleteSelectedNotes(user)
    await cancelNoteDeletion(user)

    // assert
    await expectNoUpdatedNotes([mockNoteList[1]])
    expectNoMessage()
    expectSelectedNote(mockNoteList[0])
    expectToolbar("selection")
  })
})

describe("allows new notes to be added", () => {
  test("navigates to the note creation page when the user clicks the 'Add' toolbar button", async () => {
    const user = userEvent.setup()

    // arrange
    render()

    // act
    await addNote(user)

    // assert
    expectNoteForm()
  })

  test("when there are no notes, navigates to the note creation page when the user clicks the empty state link", async () => {
    const user = userEvent.setup()

    // mock
    mockCustomNoteList([])

    // arrange
    render()

    // act
    await addNote(user, true)

    // assert
    expectNoteForm()
  })
})

describe("allows notes to be edited", () => {
  test("navigates to the note edition page when the user clicks a note card", async () => {
    const user = userEvent.setup()

    // arrange
    render()

    // act
    await editNote(user, mockNoteList[0])

    // assert
    expectNoteForm(mockNoteList[0])
  })
})
