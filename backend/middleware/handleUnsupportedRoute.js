const handleUnsupportedRoute = (req, res) =>
  res.status(404).json({ message: "Resource not found." })

module.exports = handleUnsupportedRoute
