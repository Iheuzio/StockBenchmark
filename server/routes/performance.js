const express = require('express');
const router = express.Router();
const DB = require('../db/db');

const db = new DB();

router.get('/high/:stock', async (req, res) => {
  try {
    const stock = req.params.stock;
    const bestTicker = await db.readBestPerformance(stock);
    res.json(bestTicker);
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: 'No data found' });
  }
});

router.get('/highs', async (req, res) => {
  try {
    const bestTickers = await db.findBestPerformingDays();
    res.json(bestTickers);
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: 'No data found' });
  }
});

router.get('/low/:stock', async (req, res) => {
  try {
    const stock = req.params.stock;
    const worstTicker = await db.readWorstPerformance(stock);
    res.json(worstTicker);
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: 'No data found' });
  }
});

router.get('/lows', async (req, res) => {
  try {
    const worstTickers = await db.findWorstPerformingDays();
    res.json(worstTickers);
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: 'No data found' });
  }
});

module.exports = router;