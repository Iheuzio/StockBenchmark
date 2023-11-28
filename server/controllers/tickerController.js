// tickerController.js

const tickerController = {
  // Route handler for getting a list of tickers
  getTickers: async (req, res) => {
    try {
      const tickers = await req.app.locals.db.readAllTickers();
      res.json(tickers);
    } catch (error) {
      res.status(404).json({ error: 'No data found' });
    }
  },

  // Route handler for getting data for a specific ticker
  getTickerData: async (req, res) => {
    const ticker = req.params.ticker;
    try {
      const tickerData = await req.app.locals.db.readTickerData(ticker);
      if (tickerData) {
        res.json(tickerData);
      } else {
        res.status(404).json({ error: 'Ticker not found' });
      }
    } catch (error) {
      res.status(404).json({ error: 'No data found' });
    }
  },

  getTickerThirtyDays: async (req, res) => {
    const ticker = req.params.ticker;
    try {
      const tickerData = await req.app.locals.db.readTickerThirtyDays(ticker);
      if (tickerData) {
        res.json(tickerData);
      } else {
        res.status(404).json({ error: 'Ticker not found' });
      }
    } catch (error) {
      res.status(404).json({ error: error });
    }
  },

};

module.exports = tickerController;
