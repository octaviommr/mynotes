const mongoose = require("mongoose")

const noteSchema = new mongoose.Schema({
  title: { type: String, required: [true, "Title is required."] },
  content: { type: String },
  important: { type: Boolean },
  userId: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
})

module.exports = mongoose.model("Note", noteSchema)
