const DB = require('../db/DB');

(async () => {
  let db;
  try {
    db = new DB();
    // dbname is cluster0 in my case
    await db.connect('dataset', 'quotes');
    const num = await db.deleteMany({});
    console.log(`Deleted ${num} quotes`);
  } catch (e) {
    console.error('could not delete');
    console.dir(e);
  } finally {
    if (db) {
      db.close();
    }
    process.exit();
  }
})();
