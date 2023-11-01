// import DB from './db'; using the module.exports import version

const DB = require('../db/DB');
const fs = require('fs');
const path = require('path');
const data_list = [];
const files = fs.readdirSync(path.join(__dirname, '../dataset'));

files.forEach(file => {
  const dataset = [];
  const ticker = file.split('.')[0];
  console.log(file);
  const data = fs.readFileSync(path.join(__dirname, `../dataset/${file}`), 'utf-8');
  const rows = data.split('\n');
  const columns = rows[0].split(',');
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i].split(',');
    const quote = {
      ticker: ticker,
      timestamp: row[0],
      low: row[1],
      open: row[2],
      volume: row[3],
      high: row[4],
      close: row[5],
      adjusted_close: row[6]
    };
    dataset.push(quote);
  }
  data_list.push(dataset);
});

(async () => {
  let db;
  try {
    db = new DB();
    // dbname is cluster0 in my case
    await db.connect('dataset', 'dataset');
    const num = await db.createManyTickers(data_list);
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