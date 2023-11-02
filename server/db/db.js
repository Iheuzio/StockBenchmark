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
    // eslint-disable-next-line no-console
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

  // delete all records in db
  async deleteMany(filter) {
    return await instance.collection.deleteMany(filter);
  }

  async createManyTickerData(dataToInsert) {
    const dataForInsertMany = dataToInsert.map(({ ticker, data }) => ({
      ticker,
      data,
    }));

    try {
      await this.collection.insertMany(dataForInsertMany);
    } catch (error) {
      console.error('Error inserting data for all tickers');
      console.error(error);
    }
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

  async readBestPerformance(stock) {
    const query = {
      ticker: stock
    };
  
    // Project only the necessary fields for the calculation
    const projection = {
      _id: 0,
      ticker: 1,
      data: 1
    };

    await instance.collection.createIndex({ 'data.open': 1 });
  
    const documents = await instance.collection.find(query).project(projection).toArray();
  
    let bestDay = null;
    let maxPercentage = 0;
  
    documents.forEach(doc => {
      const data = doc.data;
      data.forEach(item => {
        const open = item.open;
        const close = item.close;
        
        // Ensure open is greater than 0 to avoid division by zero
        if (open > 0) {
          const percentage = ((close - open) / open) * 100;
  
          if (percentage > maxPercentage) {
            maxPercentage = percentage;
            bestDay = {
              day: item.timestamp,
              stock: doc.ticker,
              open: open,
              close: close,
              percentage: percentage
            };
          }
        }
      });
    });
  
    return bestDay;
  }

  async findBestPerformingDays() {
    const allStocks = await instance.readAllTickers();
    const bestDaysPromises = [];

    for (const stock of allStocks) {
      bestDaysPromises.push(instance.readBestPerformance(stock.ticker));
    }

    const bestDays = await Promise.all(bestDaysPromises);

    const filteredBestDays = bestDays.filter(day => day !== null);

    filteredBestDays.sort((a, b) => b.percentage - a.percentage);

    await instance.collection.createIndex({ percentage: -1 });

    return filteredBestDays;
  }

  async readWorstPerformance(stock) {
    const query = {
      ticker: stock
    };
  
    const projection = {
      _id: 0,
      ticker: 1,
      data: 1
    };

    await instance.collection.createIndex({ 'data.open': 1 });
  
    const documents = await instance.collection.find(query).project(projection).toArray();
  
    let worstDay = null;
    let minPercentage = 0;
  
    documents.forEach(doc => {
      const data = doc.data;
      data.forEach(item => {
        const open = item.open;
        const close = item.close;
        
        // Ensure open is greater than 0 to avoid division by zero
        if (open > 0) {
          const percentage = ((close - open) / open) * 100;
  
          if (percentage < minPercentage) {
            minPercentage = percentage;
            worstDay = {
              day: item.timestamp,
              stock: doc.ticker,
              open: open,
              close: close,
              percentage: percentage
            };
          }
        }
      });
    });
  
    return worstDay;
  }

  async findWorstPerformingDays() {
    const allStocks = await instance.readAllTickers();
    const worstDaysPromises = [];

    for (const stock of allStocks) {
      worstDaysPromises.push(instance.readWorstPerformance(stock.ticker));
    }

    const worstDays = await Promise.all(worstDaysPromises);

    const filteredWorstDays = worstDays.filter(day => day !== null);

    filteredWorstDays.sort((a, b) => a.percentage - b.percentage);

    await instance.collection.createIndex({ percentage: 1 });

    return filteredWorstDays;
  }
}

module.exports = DB;

