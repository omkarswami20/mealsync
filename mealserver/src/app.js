const fastify = require('fastify')({ logger: false }); // Disable logger for tests unless needed
const cors = require('@fastify/cors');
const helmet = require('@fastify/helmet');
const websocket = require('@fastify/websocket');
const wsHandler = require('./ws/wsHandler');

// Register Plugins
fastify.register(cors, {
  origin: true
});

fastify.register(helmet);
fastify.register(websocket);
fastify.register(wsHandler.handleWs);

// Register Routes
const menuRoutes = require('./routes/menu.routes');
const orderRoutes = require('./routes/order.routes');

fastify.register(menuRoutes, { prefix: '/api' });
fastify.register(orderRoutes, { prefix: '/api' });

// Basic health check
fastify.get('/', async (request, reply) => {
  return { status: 'Mealserver is running', version: '1.0.0' };
});

module.exports = fastify;
