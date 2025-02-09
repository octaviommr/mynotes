const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const authRouter = require("./routes/auth")
const notesRouter = require("./routes/notes")
const handleUnsupportedRoute = require("./middleware/handleUnsupportedRoute")
const handleError = require("./middleware/handleError")

const app = express()

mongoose.connect(process.env.MONGODB_URI)

app.use(cors())
app.use(express.json())

// route handlers
app.use("/api/auth", authRouter)
app.use("/api/notes", notesRouter)

// unsupported routes
app.use(handleUnsupportedRoute)

// error handling
app.use(handleError)

app.listen(process.env.PORT || 3001)
