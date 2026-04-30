const request = require('supertest');
const app = require('../src/app');

describe('Menu API', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test('GET /api/menu should return 200 and an array of menu items', async () => {
    const response = await request(app.server).get('/api/menu');
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    
    const item = response.body[0];
    expect(item).toHaveProperty('id');
    expect(item).toHaveProperty('name');
    expect(item).toHaveProperty('price');
    expect(item).toHaveProperty('description');
    expect(item).toHaveProperty('image');
  });
});
