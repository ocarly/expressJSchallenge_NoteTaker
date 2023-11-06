// required dependencies 
const express = require('express');
const path = require('path');

// Helper function for generating unique ids
const uuid = require('./helpers/uuid');

// Helper functions for reading and writing to the JSON file
const { readFromFile, readAndAppend } = require('./helpers/fsUtils');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to serve up static assets from the public folder
app.use(express.static('public'));

// This view route is a GET route for the homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// This view route is a GET route for the feedback page
app.get('/feedback', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/assets/feedback.html'))
);

// This API route is a GET Route for retrieving all the tips
app.get('/api/tips', (req, res) => {
  console.info(`${req.method} request received for tips`);
  readFromFile('./db/tips.json').then((data) => res.json(JSON.parse(data)));
});

// This API route is a POST Route for a new UX/UI tip
app.post('/api/tips', (req, res) => {
  console.info(`${req.method} request received to add a tip`);

  
  const { username, topic, tip } = req.body;

  if (req.body) {
    const newTip = {
      username,
      tip,
      topic,
      tip_id: uuid(),
    };

    readAndAppend(newTip, './db/tips.json');
    res.json(`Tip added successfully`);
  } else {
    res.error('Error in adding tip');
  }
});


app.listen(PORT, function() {
    console.log(`App listening on Port: ${PORT}`);
});