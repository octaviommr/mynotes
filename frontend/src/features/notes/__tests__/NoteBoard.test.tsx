import userEvent, { UserEvent } from "@testing-library/user-event"
import { http, HttpResponse } from "msw"
import { render, screen, waitFor, within } from "../../../testUtils"
import {
  CARD_NAME_REGEX,
  expectNotes,
  expectNote,
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
  let deletedIds: string[] = []

  server.use(
    // override the original request handler to make sure we store what notes were deleted
    http.post<
      never,
      { ids: string[] },
      { deletedIds: string[] },
      `${typeof BASE_URL}/notes/deleteBatch`
    >(`${BASE_URL}/notes/deleteBatch`, async ({ request }) => {
      const { ids } = await request.json()

      // store notes to delete
      deletedIds = ids

      return HttpResponse.json({ deletedIds })
    }),

    // override the original request handler to return an updated mock note list without the notes that were deleted
    http.get<never, never, NoteResponse[], `${typeof BASE_URL}/notes`>(
      `${BASE_URL}/notes`,
      () => {
        const updatedMockNoteList = mockNoteList.filter(
          (mockNote) => !deletedIds.includes(mockNote._id),
        )

        return HttpResponse.json(updatedMockNoteList)
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

const confirmNoteDeletion = async (user: UserEvent) => {
  await user.click(
    within(screen.getByRole("alertdialog")).getByRole("button", {
      name: "Delete",
    }),
  )
}

const cancelNoteDeletion = async (user: UserEvent) => {
  await user.click(
    within(screen.getByRole("alertdialog")).getByRole("button", {
      name: "Cancel",
    }),
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
const expectEmptyState = async () => {
  const message = await screen.findByText("No notes yet.")
  expect(message).toBeInTheDocument()
}

const expectSelectedNotesCount = (count: number) => {
  expect(
    within(screen.getByRole("toolbar")).getByRole("status"),
  ).toHaveTextContent(new RegExp(`^${count}$`))
}

const expectUpdatedNotes = async (mockUpdatedNotes: NoteResponse[]) => {
  await waitFor(() => {
    // wait until list is updated
    expect(screen.getAllByRole("link", { name: CARD_NAME_REGEX })).toHaveLength(
      mockUpdatedNotes.length,
    )

    for (let i = 0; i < mockUpdatedNotes.length; i++) {
      expectNote(mockUpdatedNotes[i])
    }
  })
}

const expectNoUpdatedNotes = async (mockUpdatedNotes: NoteResponse[]) => {
  await expect(
    waitFor(() => {
      expect(
        screen.getAllByRole("link", { name: CARD_NAME_REGEX }),
      ).toHaveLength(mockUpdatedNotes.length)
    }),
  ).rejects.toThrow() // expect the list to never be updated, and so "waitFor" to time out
}

const expectNoteSelection = ({ title }: NoteResponse, isSelected: boolean) => {
  const checkbox = within(
    screen.getByRole("link", { name: `Edit ${title}` }),
  ).getByRole("checkbox", { name: `Toggle ${title}` })

  if (isSelected) {
    expect(checkbox).toBeChecked()
  } else {
    expect(checkbox).not.toBeChecked()
  }
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
    expectNoteSelection(mockNoteList[0], false)
    expectNoteSelection(mockNoteList[1], false)
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
    expectNoteDeletionAlert()
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
    await expectUpdatedNotes([mockNoteList[1]])
    expectMessage("Notes deleted successfully!")
  })

  test("doesn't change the list if the user cancels the operation", async () => {
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
    await expectNoUpdatedNotes([mockNoteList[1]])
    expectNoteSelection(mockNoteList[0], true)
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
