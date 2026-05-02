const orderStore = require('../store/orderStore');
const { menuItems } = require('../data/menu');
const { startStatusSimulation } = require('../ws/wsHandler');

class OrderService {
  async createOrder(fastify, orderData) {
    const { name, address, phone, items: itemRequests } = orderData;
    
    // Enrich items with names and prices from menuItems
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
    
    return order;
  }

  async getOrder(id) {
    const order = orderStore.getOrder(id);
    if (!order) {
      throw new Error('Order not found');
    }
    return order;
  }

  async updateStatus(id, status) {
    const order = orderStore.updateOrderStatus(id, status);
    if (!order) {
      throw new Error('Order not found');
    }
    return order;
  }

  async getAllOrders() {
    return orderStore.getAllOrders();
  }
}

module.exports = new OrderService();
