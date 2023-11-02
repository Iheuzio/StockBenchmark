const DB = require('../db/DB');

(async () => {
  let db;
  try {
    db = new DB();
    // dbname is cluster0 in my case
    await db.connect('dataset', 'stocks');
    const num = await db.deleteMany({});
    console.log(`Deleted ${num} stocks`);
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