const mongoose = require("mongoose")

// https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required."],
    match: [EMAIL_REGEX, "{VALUE} is not a valid email."],
  },
  name: { type: String, required: [true, "Name is required."] },
  password: { type: String, required: [true, "Password is required."] },
})

module.exports = mongoose.model("User", userSchema)
