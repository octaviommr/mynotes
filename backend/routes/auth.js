const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

const router = express.Router()

router.post("/login", (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(401).json({ message: "Invalid email or password." })
    return
  }

  User.findOne({ email })
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

            res.status(200).json({ token, name: user.name })
          },
        )
      })
    })
    .catch(next)
})

router.post("/signup", (req, res, next) => {
  const { email, name, password } = req.body

  bcrypt.hash(password, 10, function (err, hash) {
    if (err) {
      return next(err)
    }

    User.create({ email, name, password: hash })
      .then((user) => res.status(201).json(user))
      .catch((err) => {
        /* 
          Handle MongoDB duplicate key errors, since we're using the "unique" option in the schema (this option is NOT a
          validator and won't cause a mongoose validation error)
        */
        if (err instanceof mongoose.mongo.MongoError && err.code === 11000) {
          res.status(400).json({ message: `${email} is already in use.` })
          return
        }

        next(err)
      })
  })
})

module.exports = router
