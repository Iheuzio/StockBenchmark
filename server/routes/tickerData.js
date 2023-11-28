const express = require('express');
const router = express.Router();
const DB = require('../db/db');

const db = new DB();

// Define route for /tickers
/**
 * @swagger
 * /tickers:
 *   get:
 *     summary: Retrieve a list of all the tickers name
 *     description: Retrive tickers name, can be used to get the name of available tickers
 *     responses:
 *       200:
 *         description: List of Tickers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ticker:
 *                     type: string
 *                     description: ticker name.
 *                     example: RCRRF
 */
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
/**
 * @swagger
 * /tickers/:ticker:
 *   get:
 *     summary: Retrieve all info of :ticker
 *     description: Retrive all info of :ticker by name
 *     responce:
 *       200:
 *         description: List of Tickers
 */
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

router.get('/tickers/month/:ticker', async (req, res) => {
  try {
    const ticker = req.params.ticker;
    const tickerData = await db.readTickerThirtyDays(ticker);
    res.json(tickerData);
  } catch (error) {
    res.status(404).json({ error: error });
  }
});

module.exports = router;
