const request = require('supertest');
const app = require('../app');
const DB = require('../db/db');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
let dbInstance;


describe('GET /tickers', () => {
  beforeAll(async () => {
    jest.mock('../db/db');
  });

  afterAll(async () => {
    jest.unmock('../db/db');
  });

  test('It should respond with a JSON array of tickers', async () => {
    // Mock the database function to return tickers
    jest.spyOn(DB.prototype, 'readAllTickers').mockResolvedValue([
      { ticker: 'AAPL' },
      { ticker: 'GOOGL' },
    ]);

    const response = await request(app).get('/tickers');
    // if plain text, use text, if JSON use body
    expect(response.body).toEqual([
      { ticker: 'AAPL' },
      { ticker: 'GOOGL' },
    ]);
    expect(response.statusCode).toBe(200);
    expect(response.type).toEqual('application/json');
  });
});

describe('GET /tickers/AAPL', () => {
  test('It should respond with info about AAPL ticker', async () => {
    const tickerData = {
      ticker: 'AAPL',
      data: [
        {
          timestamp: '2020-01-01',
          low: 72.5,
          open: 74.06,
          volume: 1000000,
          high: 75.15,
          close: 75.15,
          adjusted_close: 74.06,
        },
      ],
    };

    jest.spyOn(DB.prototype, 'readTickerData').mockResolvedValue(tickerData);
    const response = await request(app).get('/tickers/AAPL');

    // if plain text, use text, if JSON use body
    expect(response.body).toEqual(tickerData);
    expect(response.statusCode).toBe(200);
    expect(response.type).toEqual('application/json');
  });
});

describe('GET /high/:stock', () => {
  test('should respond with JSON containing the best ticker for a specific stock', async () => {
    DB.prototype.readBestPerformance.mockResolvedValue({ ticker: 'AAPL' });

    const response = await request(app).get('/high/XYZ');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ ticker: 'AAPL' });
  });

  test('should handle errors and respond with 404 and error message', async () => {
    DB.prototype.readBestPerformance.mockRejectedValue(new Error('Database error'));

    const response = await request(app).get('/high/XYZ');

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({ error: 'No data found' });
  });
});

describe('GET /highs', () => {
  test('should respond with JSON containing the best performing tickers', async () => {
    DB.prototype.findBestPerformingDays.mockResolvedValue([{ ticker: 'AAPL' }, { ticker: 'GOOGL' }]);

    const response = await request(app).get('/highs');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([{ ticker: 'AAPL' }, { ticker: 'GOOGL' }]);
  });

  test('should handle errors and respond with 404 and error message', async () => {
    DB.prototype.findBestPerformingDays.mockRejectedValue(new Error('Database error'));

    const response = await request(app).get('/highs');

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({ error: 'No data found' });
  });
});

describe('GET /low/:stock', () => {
  test('should respond with JSON containing the worst ticker for a specific stock', async () => {
    DB.prototype.readWorstPerformance.mockResolvedValue({ ticker: 'XYZ' });

    const response = await request(app).get('/low/ABC');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ ticker: 'XYZ' });
  });

  test('should handle errors and respond with 404 and error message', async () => {
    DB.prototype.readWorstPerformance.mockRejectedValue(new Error('Database error'));

    const response = await request(app).get('/low/ABC');

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({ error: 'No data found' });
  });
});

describe('GET /lows', () => {
  test('should respond with JSON containing the worst performing tickers', async () => {
    DB.prototype.findWorstPerformingDays.mockResolvedValue([{ ticker: 'XYZ' }, { ticker: 'LMN' }]);

    const response = await request(app).get('/lows');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([{ ticker: 'XYZ' }, { ticker: 'LMN' }]);
  });

  test('should handle errors and respond with 404 and error message', async () => {
    DB.prototype.findWorstPerformingDays.mockRejectedValue(new Error('Database error'));

    const response = await request(app).get('/lows');

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({ error: 'No data found' });
  });
});

describe('DB', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    dbInstance = new DB();
    dbInstance.client = new MongoClient(mongoUri);
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


