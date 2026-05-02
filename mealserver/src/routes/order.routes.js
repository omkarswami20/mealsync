const orderService = require('../services/order.service');
const { ORDER_STATUS } = require('../config/constants');

async function orderRoutes(fastify, options) {
  // Schema for creating an order
  const createOrderSchema = {
    body: {
      type: 'object',
      required: ['name', 'address', 'phone', 'items'],
      properties: {
        name: { type: 'string', minLength: 1 },
        address: { type: 'string', minLength: 1 },
        phone: { 
          type: 'string', 
          pattern: '^[0-9]{10}$'
        },
        items: {
          type: 'array',
          minItems: 1,
          items: {
            type: 'object',
            required: ['id', 'quantity'],
            properties: {
              id: { type: 'number' },
              quantity: { type: 'number', minimum: 1 }
            }
          }
        }
      }
    },
    response: {
      201: {
        type: 'object',
        properties: {
          orderId: { type: 'string' }
        }
      }
    }
  };

  // POST /api/orders
  fastify.post('/orders', { schema: createOrderSchema }, async (request, reply) => {
    try {
      const order = await orderService.createOrder(fastify, request.body);
      reply.code(201).send({ orderId: order.id });
    } catch (error) {
      reply.code(400).send({ error: error.message });
    }
  });

  // GET /api/orders/:id
  fastify.get('/orders/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { 
            type: 'string',
            pattern: '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
          }
        }
      }
    },
    errorHandler: (error, request, reply) => {
      if (error.validation) {
        reply.code(400).send({ error: 'Malformed UUID' });
      } else {
        reply.send(error);
      }
    }
  }, async (request, reply) => {
    try {
      const order = await orderService.getOrder(request.params.id);
      return order;
    } catch (error) {
      return reply.code(404).send({ error: error.message });
    }
  });

  // PATCH /api/orders/:id/status
  fastify.patch('/orders/:id/status', {
    schema: {
      body: {
        type: 'object',
        required: ['status'],
        properties: {
          status: { type: 'string', enum: Object.values(ORDER_STATUS) }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const order = await orderService.updateStatus(request.params.id, request.body.status);
      return order;
    } catch (error) {
      return reply.code(400).send({ error: error.message });
    }
  });

  // GET /api/orders (Helper to see all orders)
  fastify.get('/orders', async (request, reply) => {
    return await orderService.getAllOrders();
  });
}

module.exports = orderRoutes;
