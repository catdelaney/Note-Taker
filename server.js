const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // For unique IDs

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

// HTML Routes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Routes
app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading notes:', err);
            res.status(500).json({ error: 'Failed to read notes' });
        } else {
            console.log('Notes read successfuly', data);
            res.json(JSON.parse(data));
        }
    });
});

app.post('/api/notes', (req, res) => {
    const newNote = { id: uuidv4(), ...req.body };
    fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading notes:', err); 
            res.status(500).json({ error: 'Failed to read notes' });
        } else {
            const notes = JSON.parse(data);
            notes.push(newNote);
            fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes, null, 2), (err) => {
                if (err) {
                    console.error('Error saving note:', err); 
                    res.status(500).json({ error: 'Failed to save note' });
                } else {
                    console.log('Note saved successfully:', newNote);
                    res.json(newNote);
                }
            });
        }
    });
});

app.delete('/api/notes/:id', (req, res) => {
    const { id } = req.params;
    fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading notes:', err);
            res.status(500).json({ error: 'Failed to read notes' });
        } else {
            let notes = JSON.parse(data);
            notes = notes.filter(note => note.id !== id);
            fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes, null, 2), (err) => {
                if (err) {
                    console.error('Error deleting note:', err);
                    res.status(500).json({ error: 'Failed to delete note' });
                } else {
                    console.log('Note deleted successfully:', id);
                    res.status(204).end();
                }
            });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
