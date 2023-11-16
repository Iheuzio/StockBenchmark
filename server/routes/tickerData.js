const express = require('express');
const router = express.Router();
const DB = require('../db/db');

const db = new DB();

// Define route for /tickers
router.get('/tickers', async (req, res) => {
  // Access the database connection through app.locals or other methods
  try {
    const tickers = await db.readAllTickers();
    res.json(tickers);
  } catch (error) {
    res.status(404).json({ error: 'No data found' });
  }
});

// Define route for /tickers/:ticker
router.get('/tickers/:ticker', async (req, res) => {
  // Access the database connection through app.locals or other methods
  try {
    const ticker = req.params.ticker;
    const tickerData = await db.readTickerData(ticker);
    res.json(tickerData);
  } catch (error) {
    res.status(404).json({ error: 'No data found' });
  }
});

module.exports = router;
