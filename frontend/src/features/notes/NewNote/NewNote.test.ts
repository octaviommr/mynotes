import { render } from "../../../tests/__test-utils__/testUtils"
import {
  expectNoteForm,
  expectNoteFormDefaultValues,
} from "../__test-utils__/testUtils"

// tests
describe("New note", () => {
  describe("when navigating to the note creation page", () => {
    it("displays the note creation form", async () => {
      // arrange
      render("/note/create")

      // assert
      await expectNoteForm("creation")
    })

    it("displays default values for all fields", async () => {
      // arrange
      render("/note/create")

      // assert
      await expectNoteFormDefaultValues()
    })
  })
})
