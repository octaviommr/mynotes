const express = require("express")
const Note = require("../models/Note")
const checkAuth = require("../middleware/checkAuth")

const router = express.Router()

router.get("/", checkAuth, (req, res, next) => {
  const { id } = req.userData

  Note.find({ userId: id })
    .then((notes) => {
      res.status(200).json(notes)
    })
    .catch(next)
})

router.get("/:id", (req, res) => {
  const note = req.note

  res.status(200).json(note)
})

router.post("/", checkAuth, (req, res, next) => {
  const { title, content, important } = req.body
  const { id } = req.userData

  Note.create({ title, content, important, userId: id })
    .then((note) => res.status(201).json(note))
    .catch(next)
})

router.put("/:id", (req, res, next) => {
  const note = req.note
  const { title, content, important } = req.body

  note.title = title
  note.content = content
  note.important = important

  note
    .save()
    .then((updatedNote) => res.status(200).json(updatedNote))
    .catch(next)
})

router.delete("/:id", (req, res, next) => {
  const note = req.note

  note
    .deleteOne()
    .then(() => res.status(204).end())
    .catch(next)
})

router.post("/deleteBatch", checkAuth, (req, res, next) => {
  const { ids } = req.body
  const { id } = req.userData

  /*
    Get the documents we'll actually be deleting, since some of them might not even exist or belong to another user.

    In order to return the deleted documents, we must be able to tell those that could not be deleted from those that didn't
    exist in the first place or belonged to another user.
  */
  Note.find({ _id: ids, userId: id })
    .then((notes) => {
      const idsToDelete = notes.map((note) => note._id)

      if (!idsToDelete.length) {
        // nothing to delete
        res.status(200).json({ deletedIds: [] })
        return
      }

      Note.deleteMany({ _id: idsToDelete })
        .then((result) => {
          if (result.deletedCount === idsToDelete.length) {
            res.status(200).json({ deletedIds: idsToDelete })
            return
          }

          // some documents could not be deleted
          Note.find({ _id: idsToDelete })
            .then((notes) => {
              const deletedIds = idsToDelete.reduce(
                (previousValue, currentValue) => {
                  const notDeletedNote = notes.find((note) =>
                    note._id.equals(currentValue),
                  )

                  if (notDeletedNote) {
                    return previousValue
                  }

                  return [...previousValue, currentValue]
                },
                [],
              )

              res.status(200).json({ deletedIds })
            })
            .catch(next)
        })
        .catch(next)
    })
    .catch(next)
})

router.param("id", checkAuth)
router.param("id", (req, res, next, id) => {
  Note.findById(id)
    .then((note) => {
      if (!note) {
        res.status(404).json({ message: "Note not found." })
        return
      }

      if (!note.userId.equals(req.userData.id)) {
        res.status(403).json({ message: "Access denied." })
        return
      }

      req.note = note
      next()
    })
    .catch(next)
})

module.exports = router
