const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const app = express()
const port = 3000

const User = require("./Models/userModel")
const Note = require("./Models/noteModel")

//read our env
dotenv.config()

//middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(
  cors({
    origin: "*",
  })
)

//Tokens
const jwt = require("jsonwebtoken")
const { authenticateToken } = require("./utilities")

//ROUTES
app.get('/', (req, res) => {
  // res.send('Hello Notes App')
  res.json({ data: "Hello" })
})


//create an account
app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body

  //check fullname value
  if (!fullName) {
    return res
      .status(400)
      .json({ error: true, message: "Fullname is required" })
  }

  //check email value
  if (!email) {
    return res
      .status(400)
      .json({ error: true, message: "Email is required" })
  }

  //check password value
  if (!password) {
    return res
      .status(400)
      .json({ error: true, message: "Password is required" })
  }

  //find if an user already exists
  const isUser = await User.findOne({ email: email });

  //if an user already exists
  if (isUser) {
    return res
      .status(400)
      .json({
        error: true,
        message: "User already exist",
      })
  }

  //Create a new user
  const user = new User({
    fullName,
    email,
    password
  })
  const savedUser = await user.save()

  const accessToken = jwt.sign(
    { user: savedUser },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "300m", }
  )
  //if had access_token
  return res.json({
    error: false,
    user,
    accessToken,
    message: "Registration successfull",
  })
})

//get a User
app.get("/get-user", authenticateToken, async (req, res) => {
  const { user } = req.user

  const isUser = await User.findOne({ _id: user._id })

  if (!isUser) {
    return res.sendStatus(401)
  }

  return res.json({
    user: { fullName: isUser.fullName, email: isUser.email, "_id:": isUser._id },
    message: `id:${user._id}`
  })
})

//Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body

  //check email value
  if (!email) {
    return res
      .status(400)
      .json({ error: true, message: "Email is required." })
  }

  //check password value
  if (!password) {
    return res
      .status(400)
      .json({ error: true, message: "Password is required." })
  }

  //find user info
  const userInfo = await User.findOne({ email: email })
  if (!userInfo) {
    return res
      .status(400)
      .json({ error: true, message: "User not found" })
  }

  if (userInfo.email == email && userInfo.password == password) {
    const user = { user: userInfo }
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "3000m", })
    return res
      .status(200)
      .json({
        error: false,
        message: "User loged in succefully.",
        email,
        accessToken,
      })
  } else {
    return res
      .status(400)
      .json({
        error: true,
        message: "Invalid Credential",
      })
  }
})

//Note
//Add note
app.post("/add-note", authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body
  const { user } = req.user

  //check the title value
  if (!title) {
    return res
      .status(400)
      .json({ error: true, message: "Please enter a title." })
  }

  //check the content value
  if (!content) {
    return res
      .status(400)
      .json({ error: true, message: "Please enter a content." })
  }

  //if all values exist
  try {
    const note = new Note({
      title,
      content,
      tags: tags || [],
      userId: user._id,
    })
    await note.save()

    return res
      .status(200)
      .json({
        error: false,
        note,
        message: "Note added successfully."
      })

  } catch (error) {
    return res
      .status(500)
      .json({
        error: true,
        message: "Server error."
      })
  }
})

//Edit Note
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId
  const { title, content, tags, isPinned } = req.body
  const { user } = req.user

  //check if the values haven't been changed
  if (!title && !content && !tags) {
    return res
      .status(400)
      .json({ error: true, message: "No changes provided." })
  }

  try {
    //try to find a note
    const note = await Note.findOne({ _id: noteId, userId: user._id })

    if (!note) {
      return res
        .status(404)
        .json({ error: true, message: `Note found with id:${noteId} and user:${user._id}` })
    }

    //if we find a note now we can change the value of title,content,tags and isPinned
    if (title) note.title = title
    if (content) note.content = content
    if (tags) note.tags = tags
    if (isPinned) note.isPinned = isPinned

    await note.save()

    return res
      .status(200)
      .json({
        error: false,
        note,
        message: `Note updated successfully. id:${noteId} and user:${user._id}`
      })
  } catch (error) {
    return res
      .status(500)
      .json({ error: false, message: "Server error." })
  }
})

//Get all notes
app.get("/get-all-notes", authenticateToken, async (req, res) => {
  const { user } = req.user

  try {
    const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 })
    return res
      .status(200)
      .json({
        error: false,
        notes,
        message: "All notes retrieved successfully."
      })
  } catch (error) {
    return res
      .status(500)
      .json({
        error: true,
        message: "Server error."
      })
  }
})

//Delete note
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId
  const { user } = req.user

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id })
    if (!note) {
      return res
        .status(404)
        .json({
          error: false,
          message: "Note not found."
        })
    }
    await note.deleteOne({ _id: noteId, userId: user._id })
    return res
      .status(200)
      .json({
        error: false,
        message: "Note deleted successfuly."
      })
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Server error" })
  }
})

//Update the Pin
app.put("/update-isPinned/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId
  const { isPinned } = req.body
  const { user } = req.user

  //check if the values haven't been changed
  if (!isPinned) {
    return res
      .status(400)
      .json({ error: true, message: "No changes provided." })
  }

  try {
    //try to find a note
    const note = await Note.findOne({ _id: noteId, userId: user._id })

    if (!note) {
      return res
        .status(404)
        .json({ error: true, message: `Note found with id:${noteId} and user:${user._id}` })
    }

    //if we find a note now we can change the value of isPinned
    if (isPinned) note.isPinned = isPinned

    await note.save()

    return res
      .status(200)
      .json({
        error: false,
        note,
        message: "Update pin successfully."
      })
  } catch (error) {
    return res
      .status(500)
      .json({
        error: false,
        message: "Server error."
      })
  }
})

//Search
app.get("/searchNote/", authenticateToken, async (req, res) => {
  const { user } = req.user
  const { query } = req.query

  if (!query) {
    return res
      .status(400)
      .json({
        error: true,
        message: "Search Query is required."
      })
  }
  try {
    const matchingNote = await Note.find({
      userId: user._id,
      $or: [
        { title: { $regex: new RegExp(query, "i") } },
        { content: { $regex: new RegExp(query, "i") } },
      ],
    })
    return res
      .status(200)
      .json({
        error: false,
        notes: matchingNote,
        message: "Note found."
      })
  } catch (error) {
    return res
      .status(500)
      .json({
        error: true,
        message: "Server error."
      })
  }
})

//Try to connect to any database
mongoose.connect('mongodb://localhost:27017/Notes')
  .then(() => {
    console.log('Connected to MongoDB!')
    app.listen(port, () => {
      console.log('Note APP is running in port ' + port + '.')
    })
  }
  ).catch((error) => {
    console.log(error)
  })
