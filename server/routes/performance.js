const express = require('express');
const router = express.Router();

router.get('/high/:stock', async (req, res) => {
  // Access the database connection through app.locals or other methods
  try {
    const stock = req.params.stock;
    const bestTicker = await req.app.get('db').readBestPerformance(stock);
    res.json(bestTicker);
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: 'No data found' });
  }
});

module.exports = router;