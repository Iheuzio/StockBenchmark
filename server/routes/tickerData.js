const express = require('express');
const router = express.Router();
const DB = require('../db/db');

const db = new DB();

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

/**
 * @swagger
 * /tickers/{ticker}:
 *   get:
 *     summary: Retrieve all info of {ticker}
 *     description: Retrive all info of {ticker} by name
 *     parameters:
 *       - in: path
 *         name: ticker
 *         required: true
 *         description: Name of ticker
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ticker info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: mongodb id
 *                   example: 6553ce6dff0be437b261b2a8
 *                 ticker:
 *                   type: string
 *                   description: ticker name
 *                   example: RCRRF
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       timestamp:
 *                         type: string
 *                         description: date
 *                         example: 25-08-2016
 *                       low:
 *                         type: integer
 *                         description: low of ticker
 *                         example: 12.779999732971191
 *                       open:
 *                         type: integer
 *                         description: open of ticker
 *                         example: 12.813332557678223
 *                       volume:
 *                         type: integer
 *                         description: volume of ticker
 *                         example: 6600
 *                       high:
 *                         type: integer
 *                         description: high of ticker
 *                         example: 13.183333396911621
 *                       close:
 *                         type: integer
 *                         description: close of ticker
 *                         example: 12.779999732971191
 *                       adjustedClose:
 *                         type: integer
 *                         description: adjustedClose of ticker
 *                         example: 12.276310920715332
 *       404:
 *         description: Ticker not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: error message
 *                   example: No data found
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
