const DB = require('../db/db');

(async () => {
  let db;
  try {
    db = new DB();
    // dbname is cluster0 in my case
    await db.connect('dataset', 'stocks');
    const num = await db.deleteMany({});
    // eslint-disable-next-line no-console
    console.log(`Deleted ${num} stocks`);
  } catch (e) {
    console.error('could not delete');
    // eslint-disable-next-line no-console
    console.dir(e);
  } finally {
    if (db) {
      db.close();
    }
    process.exit();
  }
})();
