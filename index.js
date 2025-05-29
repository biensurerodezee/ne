// index.js
import express from 'express'
import Datastore from 'nedb-promises'

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json())

// Set up the NeDB database
const db = Datastore.create({
  filename: 'users.db',
  autoload: true
})

// Routes

// Add a user
app.post('/users', async (req, res) => {
  try {
    const user = await db.insert(req.body)
    res.status(201).json(user)
  } catch (err) {
    res.status(500).json({ error: 'Failed to create user' })
  }
})

// Get all users
app.get('/users', async (req, res) => {
  const users = await db.find({})
  res.json(users)
})

// Get a user by ID
app.get('/users/:id', async (req, res) => {
  const user = await db.findOne({ _id: req.params.id })
  if (user) res.json(user)
  else res.status(404).json({ error: 'User not found' })
})

// Delete a user by ID
app.delete('/users/:id', async (req, res) => {
  const result = await db.remove({ _id: req.params.id })
  if (result) res.json({ success: true })
  else res.status(404).json({ error: 'User not found' })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})

