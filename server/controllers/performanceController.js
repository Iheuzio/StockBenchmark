// tickerController.js

const performanceController = {
  // Route handler for getting a list of tickers
  getBestPerformingDays: async (req, res) => {
    try {
      const tickers = await req.app.locals.db.findBestPerformingDays();
      res.json(tickers);
    } catch (error) {
      res.status(404).json({ error: 'No data found' });
    }
  },

  // Route handler for getting data for a specific ticker
  getBestPerformance: async (req, res) => {
    const stock = req.params.ticker;
    try {
      const tickerData = await req.app.locals.db.readBestPerformance(stock);
      if (tickerData) {
        res.json(tickerData);
      } else {
        res.status(404).json({ error: 'Ticker not found' });
      }
    } catch (error) {
      res.status(404).json({ error: 'No data found' });
    }
  },

  getWorstPerformingDays: async (req, res) => {
    try {
      const tickers = await req.app.locals.db.findWorstPerformingDays();
      res.json(tickers);
    } catch (error) {
      res.status(404).json({ error: 'No data found' });
    }
  },

  getWorstPerformance: async (req, res) => {
    const stock = req.params.ticker;
    try {
      const tickerData = await req.app.locals.db.readWorstPerformance(stock);
      if (tickerData) {
        res.json(tickerData);
      } else {
        res.status(404).json({ error: 'Ticker not found' });
      }
    } catch (error) {
      res.status(404).json({ error: 'No data found' });
    }
  },

};

module.exports = performanceController;
