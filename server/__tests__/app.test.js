const request = require('supertest');
const app = require('../app');
const DB = require('../db/db');
jest.mock('../db/db'); 

describe('Routes', () => {
  describe('GET /tickers', () => {
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
});

