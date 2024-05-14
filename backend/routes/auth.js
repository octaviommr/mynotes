const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const User = require("../models/User")

const router = express.Router()

router.post("/login", (req, res, next) => {
  const { email, password } = req.body

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        res.status(401).json({ message: "Invalid email or password." })
        return
      }

      bcrypt.compare(password, user.password, function (err, result) {
        if (err) {
          return next(err)
        }

        if (!result) {
          res.status(401).json({ message: "Invalid email or password." })
          return
        }

        jwt.sign(
          { email: user.email, id: user._id },
          process.env.JWT_SECRET,
          { expiresIn: "1h" },
          function (err, token) {
            if (err) {
              return next(err)
            }

            res.status(200).json({ token: token, username: user.name })
          },
        )
      })
    })
    .catch(next)
})

router.post("/signup", (req, res, next) => {
  const { email, username, password } = req.body

  bcrypt.hash(password, 10, function (err, hash) {
    if (err) {
      return next(err)
    }

    User.create({
      email: email,
      name: username,
      password: hash,
    })
      .then((user) => res.status(201).json(user))
      .catch(next)
  })
})

module.exports = router
