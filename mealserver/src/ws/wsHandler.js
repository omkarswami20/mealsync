const { ORDER_STATUS } = require('../config/constants');
const orderStore = require('../store/orderStore');

// Map of orderId -> Set of client sockets
const clients = new Map();

// Map of orderId -> Interval ID (to prevent duplicate simulations)
const simulations = new Map();

/**
 * Handle WebSocket connections
 */
async function handleWs(fastify) {
  fastify.get('/ws', { websocket: true }, (connection, req) => {
    const { orderId } = req.query;
    const socket = connection.socket || connection;

    if (!orderId) {
      socket.send(JSON.stringify({ error: 'orderId is required' }));
      socket.close(1008);
      return;
    }

    const order = orderStore.getOrder(orderId);
    if (!order) {
      socket.send(JSON.stringify({ error: 'Order not found' }));
      socket.close(1008);
      return;
    }

    // Register client
    if (!clients.has(orderId)) {
      clients.set(orderId, new Set());
    }
    clients.get(orderId).add(socket);

    fastify.log.info(`Client connected to order: ${orderId}`);

    // Send current status immediately
    socket.send(JSON.stringify({
      orderId,
      status: order.status,
      timestamp: new Date().toISOString()
    }));

    socket.on('close', () => {
      const orderClients = clients.get(orderId);
      if (orderClients) {
        orderClients.delete(socket);
        if (orderClients.size === 0) {
          clients.delete(orderId);
        }
      }
      fastify.log.info(`Client disconnected from order: ${orderId}`);
    });
  });
}

/**
 * Start status simulation for an order
 */
function startStatusSimulation(fastify, orderId) {
  if (simulations.has(orderId)) return;

  const statusProgression = [
    ORDER_STATUS.RECEIVED,
    ORDER_STATUS.PREPARING,
    ORDER_STATUS.OUT_FOR_DELIVERY,
    ORDER_STATUS.DELIVERED
  ];

  let currentIndex = 0;
  
  // Find current index if order already has a status
  const currentOrder = orderStore.getOrder(orderId);
  if (currentOrder) {
    currentIndex = statusProgression.indexOf(currentOrder.status);
    if (currentIndex === -1) currentIndex = 0;
  }

  const intervalId = setInterval(() => {
    currentIndex++;
    if (currentIndex >= statusProgression.length) {
      clearInterval(intervalId);
      simulations.delete(orderId);
      return;
    }

    const nextStatus = statusProgression[currentIndex];
    
    try {
      orderStore.updateOrderStatus(orderId, nextStatus);
      
      const message = JSON.stringify({
        orderId,
        status: nextStatus,
        timestamp: new Date().toISOString()
      });

      // Broadcast to all clients watching this order
      const orderClients = clients.get(orderId);
      if (orderClients) {
        fastify.log.info(`Broadcasting to ${orderClients.size} clients for order ${orderId}`);
        for (const client of orderClients) {
          try {
            if (client && client.readyState === 1) { // 1 = OPEN
              client.send(message);
            }
          } catch (err) {
            fastify.log.error(`Failed to send message to client: ${err.message}`);
          }
        }
      }

      fastify.log.info(`Order ${orderId} status updated to: ${nextStatus}`);

      if (nextStatus === ORDER_STATUS.DELIVERED) {
        clearInterval(intervalId);
        simulations.delete(orderId);
      }
    } catch (error) {
      fastify.log.error(`Error updating order ${orderId} status: ${error.message}`);
      clearInterval(intervalId);
      simulations.delete(orderId);
    }
  }, 5000);

  simulations.set(orderId, intervalId);
}

module.exports = {
  handleWs,
  startStatusSimulation
};
