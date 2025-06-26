import { UserEvent } from "@testing-library/user-event"
import { screen, within } from "../../../tests/__test-utils__/testUtils"
import { NoteResponse } from "../types/Note"

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

export const fillInTitleField = async (user: UserEvent, newTitle: string) => {
  const field = await screen.findByLabelText("Title (required)")
  await user.clear(field)

  if (newTitle) {
    await user.type(field, newTitle)
  }
}

export const fillInContentField = async (
  user: UserEvent,
  newContent: string,
) => {
  const field = await screen.findByLabelText("Content")
  await user.clear(field)

  if (newContent) {
    await user.type(field, newContent)
  }
}

export const toggleImportantField = async (user: UserEvent) => {
  const field = await screen.findByLabelText("Important")
  await user.click(field)
}

export const submitForm = async (
  user: UserEvent,
  mode: "creation" | "edition",
) => {
  await user.click(
    screen.getByRole("button", {
      name: mode === "creation" ? "Create" : "Update",
    }),
  )
}

// assertions
export const expectNote = (
  card: HTMLElement,
  { _id, title, content, important }: NoteResponse,
) => {
  expect(within(card).getByRole("heading", { name: title })).toBeInTheDocument()

  expect(
    within(card).getByRole("checkbox", { name: `Toggle ${title}` }),
  ).toBeInTheDocument()

  if (content) {
    expect(card).toHaveTextContent(content)
  }

  if (important) {
    expect(within(card).getByRole("status")).toHaveTextContent("Important")
  } else {
    expect(within(card).queryByRole("status")).not.toBeInTheDocument()
  }

  expect(
    within(card).getByRole("link", { name: `Edit ${title}` }),
  ).toHaveAttribute("href", `/note/${_id}`)
}

export const expectNotes = async (mockNotes: NoteResponse[]) => {
  const cards = await screen.findAllByRole("listitem")
  expect(cards).toHaveLength(mockNotes.length)

  for (let i = 0; i < mockNotes.length; i++) {
    expectNote(cards[i], mockNotes[i])
  }
}

export const expectNoteDeletionAlert = (title: string, content: string) => {
  const alert = screen.getByRole("alertdialog")

  expect(
    within(alert).getByRole("heading", { name: title }),
  ).toBeInTheDocument()

  expect(alert).toHaveTextContent(content)

  expect(
    within(alert).getByRole("button", { name: "Delete" }),
  ).toBeInTheDocument()

  expect(
    within(alert).getByRole("button", { name: "Cancel" }),
  ).toBeInTheDocument()
}

export const expectNoNoteDeletionAlert = () => {
  expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument()
}

export const expectMessage = async (message: string) => {
  const alert = await screen.findByRole("alert")
  expect(alert).toHaveTextContent(message)
}

export const expectNoteForm = async (mode: "creation" | "edition") => {
  const pageTitle = await screen.findByRole("heading", {
    name: mode === "creation" ? "New Note" : "Edit Note",
  })

  expect(pageTitle).toBeInTheDocument()

  const form = screen.getByRole("form", {
    name: mode === "creation" ? "New Note" : "Edit Note",
  })

  expect(form).toBeInTheDocument()

  expect(within(form).getByLabelText("Title (required)")).toBeRequired()
  expect(within(form).getByLabelText("Content")).toBeInTheDocument()
  expect(within(form).getByLabelText("Important")).toBeInTheDocument()

  expect(
    within(form).getByRole("button", {
      name: mode === "creation" ? "Create" : "Update",
    }),
  ).toBeInTheDocument()

  expect(within(form).getByRole("link", { name: "Cancel" })).toHaveAttribute(
    "href",
    "/",
  )

  if (mode === "edition") {
    expect(
      within(form).getByRole("button", { name: "Delete" }),
    ).toBeInTheDocument()
  }
}

export const expectNoteFormDefaultValues = async (mockNote?: NoteResponse) => {
  const form = await screen.findByRole("form", {
    name: mockNote ? "Edit Note" : "New Note",
  })

  expect(form).toHaveFormValues({
    title: mockNote ? mockNote.title : "",
    content: mockNote ? mockNote.content : "",
  })

  /* 
    Assert the value of the "Important" field individually because currently the feature that allows using Headless UI's
    "Checkbox" component with forms (by rendering a hidden input field in sync with the checkbox state) is not working 
    correctly. 
    
    Once it is, we should be able to use "toHaveFormValues" to assert the value of the "Important" form control as well.
  */
  const importantCheckbox = screen.getByLabelText("Important")

  if (mockNote && mockNote.important) {
    expect(importantCheckbox).toBeChecked()
  } else {
    expect(importantCheckbox).not.toBeChecked()
  }
}

export const expectNoteFormErrorMessage = () => {
  const titleField = screen.getByLabelText("Title (required)")
  expect(titleField).toBeInvalid()
  expect(titleField).toHaveAccessibleErrorMessage("Title is required.")
}

export const expectLocation = (pathname: string) => {
  expect(window.location.pathname).toEqual(pathname)
}
