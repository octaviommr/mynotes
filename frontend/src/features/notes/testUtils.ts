import { UserEvent } from "@testing-library/user-event"
import { screen, within } from "../../testUtils"
import { NoteResponse } from "../../api"

const CARD_NAME_REGEX = /^Edit\s+.*$/

// actions
export const confirmNoteDeletion = async (user: UserEvent) => {
  await user.click(
    within(screen.getByRole("alertdialog")).getByRole("button", {
      name: "Delete",
    }),
  )
}

export const cancelNoteDeletion = async (user: UserEvent) => {
  await user.click(
    within(screen.getByRole("alertdialog")).getByRole("button", {
      name: "Cancel",
    }),
  )
}

export const fillInTitleField = async (
  user: UserEvent,
  newTitle: string,
  mockNote?: NoteResponse,
) => {
  const form = await screen.findByRole("form", {
    name: mockNote ? mockNote.title : "New note",
  })
  const field = within(form).getByLabelText("Title (required)")
  await user.clear(field)

  if (newTitle) {
    await user.type(field, newTitle)
  }
}

export const fillInContentField = async (
  user: UserEvent,
  newContent: string,
  mockNote?: NoteResponse,
) => {
  const textbox = within(
    screen.getByRole("form", { name: mockNote ? mockNote.title : "New note" }),
  ).getByLabelText("Content")
  await user.clear(textbox)

  if (newContent) {
    await user.type(textbox, newContent)
  }
}

export const toggleImportantField = async (
  user: UserEvent,
  mockNote?: NoteResponse,
) => {
  await user.click(
    within(
      screen.getByRole("form", {
        name: mockNote ? mockNote.title : "New note",
      }),
    ).getByLabelText("Important"),
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
  expect(within(card).getByRole("paragraph")).toHaveTextContent(content)

  if (important) {
    expect(within(card).getByRole("status")).toHaveTextContent("Important")
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

export const expectNoteDeletionAlert = (title: string, content: string) => {
  const alert = screen.getByRole("alertdialog")
  expect(alert).toBeInTheDocument()

  expect(
    within(alert).getByRole("heading", { name: title }),
  ).toBeInTheDocument()
  expect(within(alert).getByRole("paragraph")).toHaveTextContent(content)
}

export const expectMessage = (message: string) => {
  const alert = screen.getByRole("alert")
  expect(alert).toBeInTheDocument()

  expect(within(alert).getByRole("paragraph")).toHaveTextContent(message)
}

export const expectNoteForm = async (mockNote?: NoteResponse) => {
  const pageTitle = await screen.findByRole("heading", {
    name: mockNote ? mockNote.title : "New note",
  })
  expect(pageTitle).toBeInTheDocument()
}

export const expectNoteFormDefaultValues = async (mockNote?: NoteResponse) => {
  const form = await screen.findByRole("form", {
    name: mockNote ? mockNote.title : "New note",
  })
  expect(form).toHaveFormValues({
    title: mockNote ? mockNote.title : "",
    content: mockNote ? mockNote.content : "",
  })

  /* 
    Assert the value of the "Important" field individually because currently the feature that allows using Headless UI's
    "Checkbox" component with forms (by rendering a hidden input field in sync with the checkbox state) is not working 
    correctly. Once it is, we should be able to use "toHaveFormValues" to assert the value of the "Important" form control
    as well.
  */
  const importantCheckbox = within(form).getByLabelText("Important")

  if (mockNote && mockNote.important) {
    expect(importantCheckbox).toBeChecked()
  } else {
    expect(importantCheckbox).not.toBeChecked()
  }
}

export const expectNoteFormErrorMessage = (mockNote?: NoteResponse) => {
  expect(
    within(
      screen.getByRole("form", {
        name: mockNote ? mockNote.title : "New note",
      }),
    ).getByRole("alert"),
  ).toHaveTextContent("Title is required.")
}
