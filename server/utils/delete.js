const DB = require('../db/db');

(async () => {
  let db;
  try {
    db = new DB();
    await db.connect('dataset', 'dataset');
    
    // Pass an empty filter to delete all documents in the collection
    const num = await db.deleteMany({});
    console.log(`Deleted ${num} documents`);
  } catch (e) {
    console.error('Could not delete');
  } finally {
    if (db) {
      db.close();
    }
    process.exit();
  }
})();
