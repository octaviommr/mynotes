const mongoose = require("mongoose")

// eslint-disable-next-line no-unused-vars
const handleError = (err, req, res, next) => {
  if (err instanceof mongoose.Error.ValidationError) {
    const firstError = err.errors[Object.keys(err.errors)[0]]

    if (firstError.reason) {
      res.status(500).json({ message: "An unknown error has occurred." })
      console.error(err)
      return
    }

    res.status(400).json({ message: firstError.message })
    return
  }

  res.status(500).json({ message: "An unknown error has occurred." })
  console.error(err)
}

module.exports = handleError
