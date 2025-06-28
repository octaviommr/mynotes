import { render } from "../../../tests/__test-utils__/testUtils"
import { mockNoteList } from "../__test-utils__/mocks"
import {
  expectNoteForm,
  expectNoteFormDefaultValues,
} from "../__test-utils__/testUtils"

// tests
describe("Note detail", () => {
  describe("when navigating to the note edition page", () => {
    it("displays the note edition form", async () => {
      // arrange
      render(`/note/${mockNoteList[0]._id}`)

      // assert
      await expectNoteForm("edition")
    })

    it("displays default values for all fields, matching the note data", async () => {
      // arrange
      render(`/note/${mockNoteList[0]._id}`)

      // assert
      await expectNoteFormDefaultValues(mockNoteList[0])
    })
  })
})
