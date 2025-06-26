import userEvent, { UserEvent } from "@testing-library/user-event"
import { http, HttpResponse } from "msw"
import { render, screen, within } from "../../../tests/__test-utils__/testUtils"
import { BASE_API_URL } from "../../../tests/handlers"
import { mockNoteList } from "../../../tests/mocks/notes"
import { server } from "../../../tests/server"
import type { NoteResponse } from "../types/Note"
import {
  confirmNoteDeletion,
  cancelNoteDeletion,
  expectNotes,
  expectNoteDeletionAlert,
  expectMessage,
  expectNoNoteDeletionAlert,
  expectLocation,
} from "../__test-utils__/noteTestUtils"

// mocks
const mockEmptyNoteList = () => {
  server.use(
    // override the original request handler to return an empty mock note list
    http.get<never, never, NoteResponse[], `${typeof BASE_API_URL}/notes`>(
      `${BASE_API_URL}/notes`,
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
      `${typeof BASE_API_URL}/notes/deleteBatch`
    >(`${BASE_API_URL}/notes/deleteBatch`, async ({ request }) => {
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
    http.get<never, never, NoteResponse[], `${typeof BASE_API_URL}/notes`>(
      `${BASE_API_URL}/notes`,
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

const addNote = async (user: UserEvent, isEmptyState = false) => {
  const addLink = await screen.findByRole("link", {
    name: `Add${isEmptyState ? " One" : ""}`,
  })

  await user.click(addLink)
}

// assertions
const expectToolbar = async () => {
  const toolbar = await screen.findByRole("toolbar")
  expect(toolbar).toBeInTheDocument()
}

const expectToolbarAddButton = async () => {
  const toolbar = await screen.findByRole("toolbar")

  expect(within(toolbar).getByRole("link", { name: "Add" })).toBeInTheDocument()
}

const expectNoteSelection = async (
  { title }: NoteResponse,
  isSelected: boolean,
) => {
  const cardCheckbox = await screen.findByRole("checkbox", {
    name: `Toggle ${title}`,
  })

  if (isSelected) {
    expect(cardCheckbox).toBeChecked()
  } else {
    expect(cardCheckbox).not.toBeChecked()
  }
}

const expectEmptyState = async () => {
  const message = await screen.findByText("No notes yet.")
  expect(message).toBeInTheDocument()

  expect(screen.getByRole("link", { name: "Add One" })).toHaveAttribute(
    "href",
    "/note/create",
  )
}

const expectSelectedNotesCount = (count: number) => {
  expect(
    within(screen.getByRole("toolbar")).getByRole("status"),
  ).toHaveTextContent(`${count}`)
}

// tests
describe("NoteBoard component", () => {
  describe("when navigating to the note board page", () => {
    describe("when there are notes", () => {
      it("displays cards for all existing notes", async () => {
        // arrange
        render()

        // assert
        await expectNotes(mockNoteList)
      })

      it("displays all notes as unselected", async () => {
        // arrange
        render()

        // assert
        for (let i = 0; i < mockNoteList.length; i++) {
          await expectNoteSelection(mockNoteList[i], false)
        }
      })

      it("displays the toolbar with an 'Add' button", async () => {
        // arrange
        render()

        // assert
        await expectToolbar()
        await expectToolbarAddButton()
      })
    })

    describe("when there are no notes", () => {
      it("displays the empty state", async () => {
        // mock
        mockEmptyNoteList()

        // arrange
        render()

        // assert
        await expectEmptyState()
      })
    })
  })

  describe("when selecting and unselecting notes", () => {
    it("displays how many notes are selected in the toolbar", async () => {
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
  })

  describe("when clearing note selection", () => {
    it("resets selection of all notes", async () => {
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

    it("resets the toolbar to the default layout, displaying a button to add new notes", async () => {
      const user = userEvent.setup()

      // arrange
      render()

      // act
      await toggleNoteSelection(user, mockNoteList[0])
      await toggleNoteSelection(user, mockNoteList[1])
      await clearNoteSelection(user)

      // assert
      await expectToolbarAddButton()
    })
  })

  describe("when deleting selected notes", () => {
    it("displays a confirmation alert", async () => {
      const user = userEvent.setup()

      // arrange
      render()

      // act
      await toggleNoteSelection(user, mockNoteList[0])
      await deleteSelectedNotes(user)

      // assert
      expectNoteDeletionAlert(
        "Delete Notes",
        "Are you sure you want to delete the selected notes?",
      )
    })

    describe("when the user confirms the deletion of the selected notes", () => {
      it("removes the deleted notes from the list", async () => {
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
      })

      it("displays a note deletion success message", async () => {
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
        await expectMessage("Notes deleted successfully!")
      })
    })

    describe("when the user cancels the deletion of the selected notes", () => {
      it("closes the confirmation alert", async () => {
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
        expectNoNoteDeletionAlert()
      })

      it("displays the same notes", async () => {
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
      })

      it("keeps note selection", async () => {
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
        await expectNoteSelection(mockNoteList[0], true)
        await expectNoteSelection(mockNoteList[1], false)
      })
    })
  })

  describe("when adding new notes", () => {
    describe("when there are notes", () => {
      describe("when clicking the 'Add' button in the toolbar", () => {
        it("navigates to the note creation page", async () => {
          const user = userEvent.setup()

          // arrange
          render()

          // act
          await addNote(user)

          // assert
          expectLocation("/note/create")
        })
      })
    })
  })
})
