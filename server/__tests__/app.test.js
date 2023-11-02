const request = require('supertest');
const express = require('express');
const app = express();
const MockDB = require('../db/MockDB'); // Import your MockDB class

// Initialize the MockDB and use it in your Express app
const mockDB = new MockDB();

// Replace your DB with the MockDB in your app
app.set('db', mockDB);

// Define your Express routes
app.get('/tickers', async (req, res) => {
  try {
    const tickers = await req.app.get('db').readAllTickers();
    res.json(tickers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.get('/tickers/:ticker', async (req, res) => {
  try {
    const ticker = req.params.ticker;
    const tickerData = await req.app.get('db').readTickerData(ticker);
    if (tickerData) {
      res.json(tickerData);
    } else {
      res.status(404).json({ error: 'Ticker not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Define other routes and middleware as needed

// Your tests
describe('GET /tickers', () => {
  it('should respond with a JSON array of tickers', async () => {
    // Set up the mock data for the test
    mockDB.data.collection = [
      { ticker: 'AAPL' },
      { ticker: 'GOOGL' },
    ];

    // Perform the GET request using Supertest
    const response = await request(app).get('/tickers');

    // Assert the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { ticker: 'AAPL' },
      { ticker: 'GOOGL' },
    ]);
  });
});

describe('GET /tickers/:ticker', () => {
  it('should respond with data for a specific ticker', async () => {
    // Set up the mock data for the test
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
    mockDB.data.collection = [tickerData];

    // Perform the GET request using Supertest
    const response = await request(app).get('/tickers/AAPL');

    // Assert the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(tickerData);
  });

  it('should respond with a 404 for an unknown ticker', async () => {
    // Set up the mock data for the test (no matching ticker)
    mockDB.data.collection = [];

    // Perform the GET request using Supertest
    const response = await request(app).get('/tickers/UNKNOWN');

    // Assert the response
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Ticker not found' });
  });
});
