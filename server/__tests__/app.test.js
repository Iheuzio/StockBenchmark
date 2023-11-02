const request = require('supertest');
const app = require('../app');
const DB = require('../db/db');

const getTickersTest = () => {
  test('It should respond with a JSON array of tickers', async () => {
    // Mock the database function to return tickers
    jest.spyOn(DB.prototype, 'readAllTickers').mockResolvedValue([
      { ticker: 'AAPL' },
      { ticker: 'GOOGL' },
    ]);

    const response = await request(app).get('/tickers');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([
      { ticker: 'AAPL' },
      { ticker: 'GOOGL' },
    ]);
  });
};

const getTickerDataTest = () => {
  test('It should respond with data for a specific ticker', async () => {
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

    // Mock the database function to return ticker data
    jest.spyOn(DB.prototype, 'readTickerData').mockResolvedValue(tickerData);

    const response = await request(app).get('/tickers/AAPL');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(tickerData);
  });
};

const postTickerDataTest = () => {
  test('It should respond with a 201 and "Ticker data added"', async () => {
    // Mock the database function to return a successful result
    jest.spyOn(DB.prototype, 'createTickerData').mockResolvedValue({ insertedId: '1' });

    const response = await request(app)
      .post('/tickers')
      .send({
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
      })
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(201);
    expect(response.text).toBe('Ticker data added');
  });
};

describe('GET /tickers', getTickersTest);
describe('GET /tickers/:ticker', getTickerDataTest);
describe('POST /tickers', postTickerDataTest);
