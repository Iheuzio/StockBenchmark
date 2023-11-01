// import DB from './db'; using the module.exports import version

const DB = require('../db/DB');

// read all the files in dataset/ folder and create an array of objects to add to the database 
// all the files are structured by tickers in the folder ie: AAPL.json, AMZN.json, etc
// so for each file you gotta read the file and parse the json and add it to the array

/* Each file looks like this:
{
    "chart": {
        "result": [
            {
                "meta": {
                    "currency": null,
                    "symbol": "CHKE",
                    "exchangeName": "NCM",
                    "instrumentType": "EQUITY",
                    "firstTradeDate": null,
                    "regularMarketTime": null,
                    "gmtoffset": -18000,
                    "timezone": "EST",
                    "exchangeTimezoneName": "America/New_York",
                    "priceHint": 2,
                    "currentTradingPeriod": {
                        "pre": {
                            "timezone": "EST",
                            "end": 1670855400,
                            "start": 1670835600,
                            "gmtoffset": -18000
                        },
                        "regular": {
                            "timezone": "EST",
                            "end": 1670878800,
                            "start": 1670855400,
                            "gmtoffset": -18000
                        },
                        "post": {
                            "timezone": "EST",
                            "end": 1670893200,
                            "start": 1670878800,
                            "gmtoffset": -18000
                        }
                    },
                    "dataGranularity": "1d",
                    "range": "",
                    "validRanges": [
                        "1d",
                        "5d"
                    ]
                },
                "indicators": {
                    "quote": [
                        {}
                    ],
                    "adjclose": [
                        {}
                    ]
                }
            }
        ],
        "error": null
    }
}
*/

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
      const quote = {
        ticker: ticker,
        timestamp: result.meta.currentTradingPeriod.regular.start,
        open: result.indicators.quote[0].open ? result.indicators.quote[0].open[0] : null,
        high: result.indicators.quote[0].high ? result.indicators.quote[0].high[0] : null,
        low: result.indicators.quote[0].low ? result.indicators.quote[0].low[0] : null,
        close: result.indicators.quote[0].close ? result.indicators.quote[0].close[0] : null,
        volume: result.indicators.quote[0].volume ? result.indicators.quote[0].volume[0] : null
      };
      quotes.push(quote);
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
    await db.connect('dataset', 'quotes');
    const num = await db.createMany(quotes);
    console.log(`Inserted ${num} quotes`);
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