import { UserEvent } from "@testing-library/user-event"
import { screen, within } from "../../testUtils"
import { NoteResponse } from "../../api"

export const CARD_NAME_REGEX = /^Edit\s+.*$/

// actions
export const fillInTitleField = async (user: UserEvent, title: string) => {
  await user.type(
    within(screen.getByRole("form", { name: "New note" })).getByRole(
      "textbox",
      { name: "Title (required)" },
    ),
    title,
  )
}

export const fillInContentField = async (user: UserEvent, content: string) => {
  await user.type(
    within(screen.getByRole("form", { name: "New note" })).getByRole(
      "textbox",
      { name: "Content" },
    ),
    content,
  )
}

export const toggleImportantField = async (user: UserEvent) => {
  await user.click(
    within(screen.getByRole("form", { name: "New note" })).getByRole(
      "checkbox",
      { name: "Important" },
    ),
  )
}

export const submitForm = async (user: UserEvent, mockNote?: NoteResponse) => {
  await user.click(
    within(
      screen.getByRole("form", {
        name: mockNote ? mockNote.title : "New note",
      }),
    ).getByRole("button", {
      name: mockNote ? "Update" : "Create",
    }),
  )
}

export const cancelForm = async (user: UserEvent, mockNote?: NoteResponse) => {
  await user.click(
    within(
      screen.getByRole("form", {
        name: mockNote ? mockNote.title : "New note",
      }),
    ).getByRole("link", { name: "Cancel" }),
  )
}

// assertions
export const expectNote = ({ title, content, important }: NoteResponse) => {
  const card = screen.getByRole("link", { name: `Edit ${title}` })
  expect(card).toBeInTheDocument()

  expect(within(card).getByRole("heading", { name: title })).toBeInTheDocument()

  expect(
    within(card).getByRole("checkbox", { name: `Toggle ${title}` }),
  ).not.toBeChecked()

  expect(within(card).getByRole("paragraph")).toHaveTextContent(
    new RegExp(`^${content}$`),
  ) // match the whole content

  if (important) {
    expect(within(card).getByRole("status")).toHaveTextContent(
      new RegExp(`^Important$`),
    ) // match the whole content
  } else {
    expect(within(card).queryByRole("status")).not.toBeInTheDocument()
  }
}

export const expectNotes = async (mockNotes: NoteResponse[]) => {
  const cards = await screen.findAllByRole("link", { name: CARD_NAME_REGEX })
  expect(cards).toHaveLength(mockNotes.length)

  for (let i = 0; i < mockNotes.length; i++) {
    expectNote(mockNotes[i])
  }
}

export const expectNoteDeletionAlert = () => {
  const alert = screen.getByRole("alertdialog")
  expect(alert).toBeInTheDocument()

  expect(
    within(alert).getByRole("heading", { name: "Delete notes" }),
  ).toBeInTheDocument()

  expect(within(alert).getByRole("paragraph")).toHaveTextContent(
    /^Are you sure you want to delete the selected notes\?$/,
  ) // match the whole content
}

export const expectMessage = (message: string) => {
  const alert = screen.getByRole("alert")
  expect(alert).toBeInTheDocument()

  expect(within(alert).getByRole("paragraph")).toHaveTextContent(
    new RegExp(`^${message}$`),
  ) // match the whole content
}

export const expectNoteForm = async (mockNote?: NoteResponse) => {
  const pageTitle = await screen.findByRole("heading", {
    name: mockNote ? mockNote.title : "New note",
  })
  expect(pageTitle).toBeInTheDocument()
}
