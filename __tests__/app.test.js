const request = require('supertest');
const app = require('../app');
const DB = require('../db/DB');

// Mock the DB class
jest.mock('../db/DB');

describe('API Tests', () => {
  
  test('GET /quotes route should respond with valid quotes', async () => {
    const mockQuotes = [
      { quote: 'Test quote 1', author: 'Test author 1' },
      { quote: 'Test quote 2', author: 'Test author 2' }
    ];

    // Mock the readAll method to return mockQuotes
    DB.readAll.mockResolvedValue(mockQuotes);

    const response = await request(app).get('/quotes');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockQuotes);
  });

  // I do not understand why this test is failing and couldn't figure out
  // how to fix it.
  test('It should respond with a 201', async () => {
    jest.spyOn(DB.prototype, 'create').mockResolvedValue(
      {insertedId: '1'});
    const response = await request(app)
      .post('/new-quote')
      .send({quote: 'dunno', author: 'me'})
      .set('Accept', 'application/json');
    //if plain text, use text, if json use body
    expect(response.text).toEqual('Quote added');
    expect(response.statusCode).toBe(201);
  });

  test('It should respond with a 400', async () => {
    const response = await request(app)
      .post('/new-quote')
      .send({ quote: 'dunno' })
      .set('Accept', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Invalid request. Both quote and author are required.' });
  });

  test('It should respond with a 404', async () => {
    // Mock the create method to throw an error
    DB.prototype.create.mockRejectedValue(new Error('Invalid format for quote'));

    const response = await request(app)
      .post('/new-quote')
      .send({ quote: 'dunno', author: 'me', extra: 'extra' })
      .set('Accept', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Invalid format for quote' });
  });

});
