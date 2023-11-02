const express = require('express');
const router = express.Router();

router.get('/high/:stock', async (req, res) => {
  try {
    const stock = req.params.stock;
    const bestTicker = await req.app.get('db').readBestPerformance(stock);
    res.json(bestTicker);
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: 'No data found' });
  }
});

router.get('/highs', async (req, res) => {
  try {
    const bestTickers = await req.app.get('db').findBestPerformingDays();
    res.json(bestTickers);
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: 'No data found' });
  }
});

router.get('/low/:stock', async (req, res) => {
  try {
    const stock = req.params.stock;
    const worstTicker = await req.app.get('db').readWorstPerformance(stock);
    res.json(worstTicker);
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: 'No data found' });
  }
});

router.get('/lows', async (req, res) => {
  try {
    const worstTickers = await req.app.get('db').findWorstPerformingDays();
    res.json(worstTickers);
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: 'No data found' });
  }
});

module.exports = router;