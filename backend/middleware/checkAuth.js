const jwt = require("jsonwebtoken")

const checkAuth = (req, res, next) => {
  const { authorization } = req.headers

  if (!authorization) {
    res.status(401).json({ message: "Authentication failed." })
    return
  }

  const token = authorization.split(" ")[1]

  jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
    if (err) {
      res.status(401).json({ message: "Authentication failed." })
      return
    }

    req.userData = decoded

    next()
  })
}

module.exports = checkAuth
