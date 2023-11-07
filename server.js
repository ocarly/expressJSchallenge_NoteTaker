// required dependencies 
const express = require('express');
const path = require('path');
const fs = require('fs')

// Helper function for generating unique ids
const {v4: uuidv4 } = require('uuid');

// Helper functions for reading and writing to the JSON file
const { readFromFile } = require('./helpers/fsUtils');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));
  

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// This API route is a GET Route for retrieving all the tips
app.get('/api/notes', (req, res) => {
  console.info(`${req.method} request received`);
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

app.post('/api/notes', (req, res) => {
  const {title, text}=req.body
  const readNoteStuff = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'))
  const postedNote = { title, text, id:uuidv4() }
  readNoteStuff.push(postedNote)
  fs.writeFileSync('./db/db.json', JSON.stringify(readNoteStuff))
  res.json(readNoteStuff)
})

app.delete('/api/notes/:id', (req, res) => {
  const readNoteStuff = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'))
  const filteredNotes = readNoteStuff.filter((badNote) => {
    return badNote.id !== req.params.id
  })
  fs.writeFileSync('./db/db.json', JSON.stringify(filteredNotes))
  res.json({ message: 'your note is ded' })
})


app.listen(PORT, function() {
    console.log(`App listening on Port: ${PORT}`);
});