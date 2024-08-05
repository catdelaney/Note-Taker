const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

module.exports = function(app) {
  app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, '../db/db.json'), 'utf8', (err, data) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(JSON.parse(data));
    });
  });

  app.post('/api/notes', (req, res) => {
    const newNote = { ...req.body, id: uuidv4() };

    fs.readFile(path.join(__dirname, '../db/db.json'), 'utf8', (err, data) => {
      if (err) return res.status(500).json({ error: err.message });
      const notes = JSON.parse(data);
      notes.push(newNote);

      fs.writeFile(path.join(__dirname, '../db/db.json'), JSON.stringify(notes, null, 2), (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(newNote);
      });
    });
  });

  app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;

    fs.readFile(path.join(__dirname, '../db/db.json'), 'utf8', (err, data) => {
      if (err) return res.status(500).json({ error: err.message });
      let notes = JSON.parse(data);
      notes = notes.filter(note => note.id !== noteId);

      fs.writeFile(path.join(__dirname, '../db/db.json'), JSON.stringify(notes, null, 2), (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Note deleted successfully' });
      });
    });
  });
};
