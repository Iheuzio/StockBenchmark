const request = require('supertest');
const app = require('../app');
const DB = require('../db/db');

jest.mock('../db/db');

describe('GET /tickers', () => {
  test('It should respond with a JSON array of tickers', async () => {
    // Mock the database function to return tickers
    jest.spyOn(DB.prototype, 'readAllTickers').mockResolvedValue([
      { ticker: 'AAPL' },
      { ticker: 'GOOGL' },
    ]);

    const response = await request(app).get('/tickers');
    //if plain text, use text, if json use body
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
    const response = await request(app).get('/tickers/AAPL')

    //if plain text, use text, if json use body
    expect(response.body).toEqual(tickerData);
    expect(response.statusCode).toBe(200);
    expect(response.type).toEqual('application/json');
  });
});
