const express = require('express');
const app = express();
const compression = require('compression');

// use compression express
app.use(compression());

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
