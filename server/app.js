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

// Default 404 route
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

module.exports = app;
