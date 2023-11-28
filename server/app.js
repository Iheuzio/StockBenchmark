const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const express = require('express');
const app = express();
const compression = require('compression');

// use compression express
app.use(compression());

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Stock Benchmark Express API',
    version: '1.0.0',
  },
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
