require('dotenv').config();
const dbUrl = process.env.ATLAS_URI;
const { MongoClient } = require('mongodb');

let instance = null;
class DB {
    constructor(){
   //instance is the singleton, defined in outer scope
    if (!instance){
      instance = this;
      this.client = new MongoClient(dbUrl);
      this.db = null;
      this.collection = null;
    }
    return instance;
  }

  async connect(dbname, collName) {
    if (instance.db){
      return;
    }
    await instance.client.connect();
    instance.db = await instance.client.db(dbname);
    // Send a ping to confirm a successful connection
    await instance.client.db(dbname).command({ ping: 1 });
    console.log('Successfully connected to MongoDB database ' + dbname);
    instance.collection = await instance.db.collection(collName);
  }

  async close() {
    await instance.client.close();
    instance = null;
  }

  async readAll() {
    return await instance.collection.find().toArray();
  }

  async create(quote) {
    return await instance.collection.insertOne(quote);
  }

  async open(dbname, collName) {
    try {
      await instance.connect(dbname, collName);
    } finally {
      await instance.close();
    }
  }

  async createMany(quotes) {
    return await instance.collection.insertMany(quotes);
  }

  // delete all records in db
  async deleteMany(filter) {
    return await instance.collection.deleteMany(filter)
  }

  async createManyTickers(data_list) {
    let count = 0;
    for (let i = 0; i < data_list.length; i++) {
      const ticker = data_list[i];
      const result = await instance.collection.insertMany(ticker);
      count += result.insertedCount;
    }
    return count;
  }

  async createTickerData(ticker, data) {
    const tickerData = {
      ticker: ticker,
      data: data
    };
    return await instance.collection.insertOne(tickerData);
  }

  async readTickerData(ticker) {
    return await instance.collection.findOne({ ticker: ticker });
  }

  async readAllTickers() {
    // return every ticker ticker: "ticker value" from all the items in the db
    return await instance.collection.find().project({ _id: 0, ticker: 1 }).toArray();
  }
}

module.exports = DB;

