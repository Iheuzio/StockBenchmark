const express = require('express');
const cors = require('cors'); // Import the cors middleware
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// GET route to read all quotes
app.get('/quotes', async (req, res) => {
  // Access the database connection through app.locals or other methods
  try {
    const quotes = await app.get('db').readAll();
    res.json(quotes);
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: 'No data found' });
  }
});

// POST route to create a new quote
app.post('/new-quote', async (req, res) => {
  // Access the database connection through app.locals or other methods
  const { quote, author } = req.body;
  if (!quote || !author) {
    res.status(400).json({ error: 'Invalid request. Both quote and author are required.' });
    return;
  }

  try {
    const result = await app.get('db').create({ quote, author });
    res.json({ message: 'Quote created successfully', result });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Invalid format for quote' });
  }
});

// Serve static files from the './public' directory
app.use(express.static('public'));

// Default 404 route
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

module.exports = app;
