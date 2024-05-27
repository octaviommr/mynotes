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
    validate: {
      validator: function (email) {
        const doc = this

        return new Promise((resolve) =>
          // make sure the email address isn't already being used by another user
          doc.constructor.findOne({ email }).then((user) => {
            if (user) {
              resolve(doc._id === user._id)
            }

            resolve(true)
          }),
        )
      },
      message: (props) => `${props.value} is already in use.`,
    },
  },
  username: { type: String, required: [true, "Username is required."] },
  password: { type: String, required: [true, "Password is required."] },
})

module.exports = mongoose.model("User", userSchema)
