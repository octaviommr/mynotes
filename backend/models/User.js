const mongoose = require("mongoose")

// https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address
const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: [true, "User email is required."],
    match: [emailRegex, "{VALUE} is not a valid email."],
    validate: {
      validator: function (email) {
        const doc = this

        return new Promise((resolve) => {
          doc.constructor.findOne({ email: email }).then((user) => {
            if (user) {
              if (doc._id === user._id) {
                resolve(true)
              }

              resolve(false)
            }

            resolve(true)
          })
        })
      },
      message: (props) => `${props.value} is already in use.`,
    },
  },
  name: { type: String, required: [true, "User name is required."] },
  password: { type: String, required: [true, "User password is required."] },
})

module.exports = mongoose.model("User", userSchema)
