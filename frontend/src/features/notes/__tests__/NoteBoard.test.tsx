import userEvent, { UserEvent } from "@testing-library/user-event"
import { http, HttpResponse } from "msw"
import { render, screen, within } from "../../../testUtils"
import {
  confirmNoteDeletion,
  cancelNoteDeletion,
  expectNotes,
  expectNoteDeletionAlert,
  expectMessage,
  expectNoteForm,
} from "../testUtils"
import { mockNoteList } from "../../../mocks/handlers"
import { server } from "../../../mocks/node"
import { BASE_URL, NoteResponse } from "../../../api"

// mocks
const mockEmptyNoteList = () => {
  server.use(
    // override the original request handler to return an empty mock note list
    http.get<never, never, NoteResponse[], `${typeof BASE_URL}/notes`>(
      `${BASE_URL}/notes`,
      () => {
        return HttpResponse.json([])
      },
    ),
  )
}

const mockNoteDeletion = () => {
  let currentMockNoteList = [...mockNoteList]

  server.use(
    // override the original request handler to keep an updated mock note list when notes are deleted
    http.post<
      never,
      { ids: string[] },
      { deletedIds: string[] },
      `${typeof BASE_URL}/notes/deleteBatch`
    >(`${BASE_URL}/notes/deleteBatch`, async ({ request }) => {
      const { ids } = await request.json()

      const result = currentMockNoteList.reduce<[string[], NoteResponse[]]>(
        (previousValue, currentValue) =>
          ids.includes(currentValue._id)
            ? [[...previousValue[0], currentValue._id], [...previousValue[1]]]
            : [[...previousValue[0]], [...previousValue[1], currentValue]],
        [[], []],
      )

      // update current mock note list
      currentMockNoteList = result[1]

      return HttpResponse.json({ deletedIds: result[0] })
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

// actions
const toggleNoteSelection = async (
  user: UserEvent,
  { title }: NoteResponse,
) => {
  const card = await screen.findByRole("link", { name: `Edit ${title}` })
  await user.click(
    within(card).getByRole("checkbox", { name: `Toggle ${title}` }),
  )
}

const clearNoteSelection = async (user: UserEvent) => {
  await user.click(
    within(screen.getByRole("toolbar")).getByRole("button", {
      name: "Clear selection",
    }),
  )
}

const deleteSelectedNotes = async (user: UserEvent) => {
  await user.click(
    within(screen.getByRole("toolbar")).getByRole("button", { name: "Delete" }),
  )
}

const addNote = async (user: UserEvent, isEmptyState = false) => {
  if (isEmptyState) {
    const addLink = await screen.findByRole("link", { name: "Add one" })
    await user.click(addLink)
  } else {
    const toolbar = await screen.findByRole("toolbar")
    await user.click(within(toolbar).getByRole("link", { name: "Add" }))
  }
}

const editNote = async (user: UserEvent, { title }: NoteResponse) => {
  const card = await screen.findByRole("link", {
    name: `Edit ${title}`,
  })
  await user.click(card)
}

// assertions
const expectNoteSelection = async (
  { title }: NoteResponse,
  isSelected: boolean,
) => {
  const card = await screen.findByRole("link", { name: `Edit ${title}` })
  const checkbox = within(card).getByRole("checkbox", {
    name: `Toggle ${title}`,
  })

  if (isSelected) {
    expect(checkbox).toBeChecked()
  } else {
    expect(checkbox).not.toBeChecked()
  }
}

const expectEmptyState = async () => {
  const message = await screen.findByText("No notes yet.")
  expect(message).toBeInTheDocument()
}

const expectSelectedNotesCount = (count: number) => {
  expect(
    within(screen.getByRole("toolbar")).getByRole("status"),
  ).toHaveTextContent(`${count}`)
}

// tests
describe("lists existing notes", () => {
  test("displays cards for all existing notes", async () => {
    // arrange
    render()

    // assert
    await expectNotes(mockNoteList)
  })

  test("displays empty state when there are no notes", async () => {
    // mock
    mockEmptyNoteList()

    // arrange
    render()

    // assert
    await expectEmptyState()
  })
})

describe("provides selection features", () => {
  test("initially, all notes are unselected", async () => {
    // arrange
    render()

    // assert
    await expectNoteSelection(mockNoteList[0], false)
    await expectNoteSelection(mockNoteList[1], false)
  })

  test("displays the correct selected notes count as the user selects and unselects notes", async () => {
    const user = userEvent.setup()

    // arrange
    render()

    // act
    await toggleNoteSelection(user, mockNoteList[0])

    // assert
    expectSelectedNotesCount(1)

    // act
    await toggleNoteSelection(user, mockNoteList[1])

    // assert
    expectSelectedNotesCount(2)

    // act
    await toggleNoteSelection(user, mockNoteList[1])

    // assert
    expectSelectedNotesCount(1)
  })

  test("clears note selection when the user clicks the 'X' mark button in the selection toolbar", async () => {
    const user = userEvent.setup()

    // arrange
    render()

    // act
    await toggleNoteSelection(user, mockNoteList[0])
    await toggleNoteSelection(user, mockNoteList[1])
    await clearNoteSelection(user)

    // assert
    await expectNoteSelection(mockNoteList[0], false)
    await expectNoteSelection(mockNoteList[1], false)
  })
})

describe("deletes selected notes", () => {
  test("displays an alert when the user tries to delete a selected note", async () => {
    const user = userEvent.setup()

    // arrange
    render()

    // act
    await toggleNoteSelection(user, mockNoteList[0])
    await deleteSelectedNotes(user)

    // assert
    expectNoteDeletionAlert(
      "Delete notes",
      "Are you sure you want to delete the selected notes?",
    )
  })

  test("updates the list and displays a success message when the user confirms the operation", async () => {
    const user = userEvent.setup()

    // arrange
    render()

    // act
    await toggleNoteSelection(user, mockNoteList[0])

    // mock
    mockNoteDeletion()

    // act
    await deleteSelectedNotes(user)
    await confirmNoteDeletion(user)

    // assert
    await expectNotes([mockNoteList[1]])
    /*
      NOTE: it's ok to expect the updated list right after the confirmation action because, although deleting a note
      involves some API calls, the promise returned by user events includes an extra delay to allow asynchronous updates
      to happen (which will be enough since all our API calls are mocked)
    */

    expectMessage("Notes deleted successfully!")
  })

  test("doesn't change the list nor note selection if the user cancels the operation", async () => {
    const user = userEvent.setup()

    // arrange
    render()

    // act
    await toggleNoteSelection(user, mockNoteList[0])

    // mock
    mockNoteDeletion()

    // act
    await deleteSelectedNotes(user)
    await cancelNoteDeletion(user)

    // assert
    await expectNotes(mockNoteList)
    await expectNoteSelection(mockNoteList[0], true)
    await expectNoteSelection(mockNoteList[1], false)
  })
})

describe("allows note creation", () => {
  test("navigates to the note creation page when the user clicks the plus button in the default toolbar", async () => {
    const user = userEvent.setup()

    // arrange
    render()

    // act
    await addNote(user)

    // assert
    await expectNoteForm()
  })

  test("navigates to the note creation page when the user clicks the 'Add one' link in the empty state", async () => {
    const user = userEvent.setup()

    // mock
    mockEmptyNoteList()

    // arrange
    render()

    // act
    await addNote(user, true)

    // assert
    await expectNoteForm()
  })
})

describe("allows note edition", () => {
  test("navigates to the note edition page when the user clicks a note card", async () => {
    const user = userEvent.setup()

    // arrange
    render()

    // act
    await editNote(user, mockNoteList[0])

    // assert
    await expectNoteForm(mockNoteList[0])
  })
})
