const mongoose = require("mongoose")
const User = require("./User")

const noteSchema = new mongoose.Schema({
  title: { type: String, required: [true, "Title is required."] },
  content: { type: String },
  important: {
    type: Boolean,
    required: [true, "Importance status is required."],
  },
  userID: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: [true, "User is required."],
    validate: {
      validator: function (userID) {
        return new Promise((resolve) =>
          User.findOne({ _id: userID }).then((user) => resolve(!!user)),
        )
      },
      message: () => "User not found.",
    },
  },
})

module.exports = mongoose.model("Note", noteSchema)
