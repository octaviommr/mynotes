const mongoose = require("mongoose")
const User = require("./User")

const noteSchema = new mongoose.Schema({
  title: { type: String, required: [true, "Title is required."] },
  content: { type: String },
  important: { type: Boolean },
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: [true, "User is required."],

    // foreign key validation
    validate: {
      validator: function (userId) {
        return new Promise((resolve) =>
          User.findOne({ _id: userId }).then((user) => resolve(!!user)),
        )
      },
      message: () => "User not found.",
    },
  },
})

module.exports = mongoose.model("Note", noteSchema)
