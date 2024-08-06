const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const dbPath = path.join(__dirname, '../db/db.json')

module.exports = (app) => 
    app.get('/api/notes', (req, res) => {
        fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to read notes' });
        }
        res.json(JSON.parse(data));
    });
  });

  app.post('/api/notes', (req, res) => {
    const newNote = { ...req.body, id: uuidv4() };

    fs.readFile(dbPath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to read notes.' });
      }
      const notes = JSON.parse(data);
      notes.push(newNote);

      fs.writeFile(dbPath, JSON.stringify(notes, null, 2), (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to save note.'});
        }
        res.json(newNote);
      });
    });
  });

  app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;

    fs.readFile(dbPath, 'utf8', (err, data) => {
      if (err) return res.status(500).json({ error: 'Failed to read notes.' });
      let notes = JSON.parse(data);
      notes = notes.filter(note => note.id !== noteId);

      fs.writeFile(path.join(__dirname, '../db/db.json'), JSON.stringify(notes, null, 2), (err) => {
        if (err) {
            console.error(err); 
            return res.status(500).json({ error: 'Failed to delete note' });
        }
        res.json({ message: 'Note deleted successfully' });
      });
    });
  });
