const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
const DB = require('../db/db');

let mongoServer;
let dbInstance;

describe('DB', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    dbInstance = new DB(mongoUri);
  });
  
  afterAll(async () => {
    await dbInstance.close();
    await mongoServer.stop();
  });

  test('connects to the database', async () => {
    await dbInstance.connect('testdb', 'testcoll');
    expect(dbInstance.db).toBeDefined();
    expect(dbInstance.collection).toBeDefined();
  });

  test('inserts a document into the collection', async () => {
    const mockData = {
      _id: '1234567891',
      ticker: 'MSFT',
      data: 
      [
        {
          timestamp: '2023-01-01',
          low: 100.0,
          open: 105.0,
          volume: 1000,
          high: 110.0,
          close: 108.0,
          adjustedClose: 107.5,
        },
        {
          timestamp: '2023-01-02',
          low: 100.0,
          open: 105.0,
          volume: 1000,
          high: 110.0,
          close: 108.0,
          adjustedClose: 107.5,
        },
        {
          timestamp: '2023-01-03',
          low: 100.0,
          open: 105.0,
          volume: 1000,
          high: 110.0,
          close: 108.0,
          adjustedClose: 107.5,
        }
      ]
    }

    await dbInstance.create(mockData);
  });

  test('reads a document from the collection', async () => {
    const mockData = {
      _id: '1234567890',
      ticker: 'AAPL',
      data: [
        {
          timestamp: '2023-01-01',
          low: 100.0,
          open: 105.0,
          volume: 1000,
          high: 110.0,
          close: 108.0,
          adjustedClose: 107.5,
        },
        {
          timestamp: '2023-01-02',
          low: 100.0,
          open: 105.0,
          volume: 1000,
          high: 110.0,
          close: 108.0,
          adjustedClose: 107.5,
        },
        {
          timestamp: '2023-01-03',
          low: 100.0,
          open: 105.0,
          volume: 1000,
          high: 110.0,
          close: 108.0,
          adjustedClose: 107.5,
        }
      ]
    };

    await dbInstance.create(mockData);
    const result = await dbInstance.readAll();
    expect(result).toEqual(expect.arrayContaining([mockData]));
  });

  test('reads the best performance for a stock', async () => {
    const stock = 'AAPL';
    const bestPerformance = await dbInstance.readBestPerformance(stock);
    expect(bestPerformance).toBeDefined();
  });

  test('finds the best performing days for all stocks', async () => {
    const bestPerformingDays = await dbInstance.findBestPerformingDays();
    expect(bestPerformingDays).toBeDefined();
  });

  test('reads the worst performance for a stock', async () => {
    const stock = 'AAPL';
    const worstPerformance = await dbInstance.readWorstPerformance(stock);
    expect(worstPerformance).toBeDefined();
  });

  test('finds the worst performing days for all stocks', async () => {
    const worstPerformingDays = await dbInstance.findWorstPerformingDays();
    expect(worstPerformingDays).toBeDefined();
  });
});