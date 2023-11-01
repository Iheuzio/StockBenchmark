// import DB from './db'; using the module.exports import version
const DB = require('../db/DB');
const fs = require('fs');
const path = require('path');
const quotes = [];
const files = fs.readdirSync(path.join(__dirname, '../dataset'));
files.forEach(file => {
  const ticker = file.split('.')[0];
  console.log(file);
  const data = fs.readFileSync(path.join(__dirname, `../dataset/${file}`));
  const parsed = JSON.parse(data);
  if (Array.isArray(parsed.chart.result)) {
    parsed.chart.result.forEach(result => {
    if (result.indicators.quote[0]) {
      if (result.timestamp) {
        const tickerData = []
        for (let i = 0; i < result.timestamp.length; i++) {
          const single = {
            timestamp: result.timestamp[i],
            open: result.indicators.quote[0].open[i],
            high: result.indicators.quote[0].high[i],
            low: result.indicators.quote[0].low[i],
            close: result.indicators.quote[0].close[i],
            volume: result.indicators.quote[0].volume[i],
          }
          tickerData.push(single)
        }
        const quote = {
          ticker: ticker,
          start_timestamp: result.meta.currentTradingPeriod.regular.start,
          data: tickerData
        };
        
        quotes.push(quote);
      }
    } else {
      console.error(`Invalid data in file ${file}`);
    }
  });
  }
});

(async () => {
  let db;
  try {
    db = new DB();
    // dbname is cluster0 in my case
    await db.connect('dataset', 'stocks');
    const num = await db.createMany(quotes);
    console.log(`Inserted ${num} stocks`);
  } catch (e) {
    console.error('could not seed');
    console.dir(e);
  } finally {
    if (db) {
      db.close();
    }
    process.exit();
  }
})();
