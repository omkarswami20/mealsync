const orderStore = require('../store/orderStore');
const { menuItems } = require('../data/menu');
const { ORDER_STATUS } = require('../config/constants');
const { startStatusSimulation } = require('../ws/wsHandler');

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
    const { name, address, phone, items: itemRequests } = request.body;
    
    // Expand items with names and prices from menuItems
    let totalAmount = 0;
    const enrichedItems = itemRequests.map(itemReq => {
      const menuItem = menuItems.find(m => m.id === itemReq.id);
      if (!menuItem) {
        throw new Error(`Item with id ${itemReq.id} not found`);
      }
      const itemTotal = menuItem.price * itemReq.quantity;
      totalAmount += itemTotal;
      return {
        ...itemReq,
        name: menuItem.name,
        price: menuItem.price,
        image: menuItem.image
      };
    });
    
    const order = orderStore.createOrder({ 
      name, 
      address, 
      phone, 
      items: enrichedItems, 
      totalAmount 
    });
    
    // Start status simulation
    startStatusSimulation(fastify, order.id);
    
    reply.code(201).send({ orderId: order.id });
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
    const { id } = request.params;
    const order = orderStore.getOrder(id);
    if (!order) {
      return reply.code(404).send({ error: 'Order not found' });
    }
    return order;
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
    const { id } = request.params;
    const { status } = request.body;
    
    try {
      const order = orderStore.updateOrderStatus(id, status);
      if (!order) {
        return reply.code(404).send({ error: 'Order not found' });
      }
      return order;
    } catch (error) {
      return reply.code(400).send({ error: error.message });
    }
  });

  // GET /api/orders (Helper to see all orders)
  fastify.get('/orders', async (request, reply) => {
    return orderStore.getAllOrders();
  });
}

module.exports = orderRoutes;
