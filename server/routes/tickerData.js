const express = require('express');
const router = express.Router();

// Define route for /tickers
router.get('/tickers', async (req, res) => {
  // Access the database connection through app.locals or other methods
  try {
    const tickers = await req.app.get('db').readAllTickers();
    res.json(tickers);
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: 'No data found' });
  }
});

// Define route for /tickers/:ticker
router.get('/tickers/:ticker', async (req, res) => {
  // Access the database connection through app.locals or other methods
  try {
    const ticker = req.params.ticker;
    const tickerData = await req.app.get('db').readTickerData(ticker);
    res.json(tickerData);
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: 'No data found' });
  }
});

module.exports = router;
