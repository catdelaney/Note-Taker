const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const dbPath = path.join(__dirname, 'db', 'db.json');

// Function to read notes from the database
const readNotes = () => {
  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data);
};

// Function to write notes to the database
const writeNotes = (notes) => {
  fs.writeFileSync(dbPath, JSON.stringify(notes, null, 2));
};

// GET route to retrieve all notes
router.get('/', (req, res) => {
  const notes = readNotes();
  res.json(notes);
});

// POST route to add a new note
router.post('/', (req, res) => {
  const { title, text } = req.body;
  const newNote = { id: uuidv4(), title, text };

  const notes = readNotes();
  notes.push(newNote);
  writeNotes(notes);

  res.json(newNote);
});

// DELETE route to delete a note
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const notes = readNotes();
  const filteredNotes = notes.filter((note) => note.id !== id);

  writeNotes(filteredNotes);
  res.json({ message: 'Note deleted' });
});

module.exports = router;