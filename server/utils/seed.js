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
      // eslint-disable-next-line no-console
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
          adjustedClose: parseFloat(row[6])
        };
        dataset.push(quote);
      }
      
      dataToInsert.push({ ticker, data: dataset });
    }

    await db.createManyTickerData(dataToInsert);
    
  } catch (e) {
    console.error('Could not seed');
    // eslint-disable-next-line no-console
    console.dir(e);
  } finally {
    if (db) {
      db.close();
    }
    process.exit();
  }
})();
