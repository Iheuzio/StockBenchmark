const DB = require('../db/db');
const fs = require('fs');
const path = require('path');

(async () => {
  let db;
  try {
    db = new DB();
    await db.connect('dataset', 'dataset');
    
    const files = fs.readdirSync(path.join(__dirname, '../dataset'));
    const dataToInsert = [];

    for (const file of files) {
      const ticker = file.split('.')[0];
      console.log(file);
      const data = fs.readFileSync(path.join(__dirname, `../dataset/${file}`), 'utf-8');
      const rows = data.split('\n');
      const columns = rows[0].split(',');
      const dataset = [];
      
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i].split(',');
        if (row.length !== columns.length || row[0] === '') {
          continue;
        }
        const quote = {
          timestamp: row[0],
          low: parseFloat(row[1]),
          open: parseFloat(row[2]),
          volume: parseInt(row[3]),
          high: parseFloat(row[4]),
          close: parseFloat(row[5]),
          adjusted_close: parseFloat(row[6])
        };
        dataset.push(quote);
      }
      
      dataToInsert.push({ ticker, data: dataset });
      console.log(`Data prepared for ticker: ${ticker}`);
    }

    // Use the createManyTickerData method in the DB class to insert all the data for each ticker at once
    await db.createManyTickerData(dataToInsert);
    console.log(`Inserted data for all tickers`);
    
  } catch (e) {
    console.error('Could not seed');
    console.dir(e);
  } finally {
    if (db) {
      db.close();
    }
    process.exit();
  }
})();
