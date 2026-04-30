const request = require('supertest');
const app = require('../src/app');

describe('Orders API', () => {
  let createdOrderId;

  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Happy Path', () => {
    test('POST /api/orders should create an order and return 201 with orderId', async () => {
      const validOrder = {
        name: 'John Doe',
        address: '123 Main St, Springfield',
        phone: '1234567890',
        items: [
          { id: 1, quantity: 2 },
          { id: 2, quantity: 1 }
        ]
      };

      const response = await request(app.server)
        .post('/api/orders')
        .send(validOrder);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('orderId');
      expect(response.body.orderId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
      
      createdOrderId = response.body.orderId;
    });

    test('GET /api/orders/:id should return order details including status', async () => {
      const response = await request(app.server).get(`/api/orders/${createdOrderId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', createdOrderId);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('name', 'John Doe');
    });
  });

  describe('Edge Cases - POST /api/orders', () => {
    test('should return 400 when name is missing', async () => {
      const response = await request(app.server)
        .post('/api/orders')
        .send({
          address: '123 Main St',
          phone: '1234567890',
          items: [{ id: 1, quantity: 1 }]
        });

      expect(response.status).toBe(400);
      expect(JSON.stringify(response.body)).toMatch(/name/);
    });

    test('should return 400 when address is missing', async () => {
      const response = await request(app.server)
        .post('/api/orders')
        .send({
          name: 'John Doe',
          phone: '1234567890',
          items: [{ id: 1, quantity: 1 }]
        });

      expect(response.status).toBe(400);
      expect(JSON.stringify(response.body)).toMatch(/address/);
    });

    test('should return 400 when phone is missing', async () => {
      const response = await request(app.server)
        .post('/api/orders')
        .send({
          name: 'John Doe',
          address: '123 Main St',
          items: [{ id: 1, quantity: 1 }]
        });

      expect(response.status).toBe(400);
      expect(JSON.stringify(response.body)).toMatch(/phone/);
    });

    test('should return 400 when items is empty', async () => {
      const response = await request(app.server)
        .post('/api/orders')
        .send({
          name: 'John Doe',
          address: '123 Main St',
          phone: '1234567890',
          items: []
        });

      expect(response.status).toBe(400);
    });

    test('should return 400 when item quantity is 0', async () => {
      const response = await request(app.server)
        .post('/api/orders')
        .send({
          name: 'John Doe',
          address: '123 Main St',
          phone: '1234567890',
          items: [{ id: 1, quantity: 0 }]
        });

      expect(response.status).toBe(400);
    });

    test('should return 400 for invalid phone format', async () => {
      const response = await request(app.server)
        .post('/api/orders')
        .send({
          name: 'John Doe',
          address: '123 Main St',
          phone: '12345', // too short
          items: [{ id: 1, quantity: 1 }]
        });

      expect(response.status).toBe(400);
    });
  });

  describe('Edge Cases - GET /api/orders/:id', () => {
    test('should return 404 for non-existent order id', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      const response = await request(app.server).get(`/api/orders/${nonExistentId}`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Order not found' });
    });

    test('should return 400 for malformed UUID', async () => {
      const malformedId = 'not-a-uuid';
      const response = await request(app.server).get(`/api/orders/${malformedId}`);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Malformed UUID' });
    });
  });
});
