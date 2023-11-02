const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for all routes
app.use(cors());

// Import the tickerRoute and use it
const tickerRoute = require('./routes/tickerData');
app.use('/', tickerRoute);

const performanceRoute = require('./routes/performance');
app.use('/', performanceRoute);

// Use the react app as front
app.use(express.static('../client/build'));


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

// Default 404 route
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

module.exports = app;
