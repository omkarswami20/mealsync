const { ORDER_STATUS } = require('../config/constants');
const crypto = require('crypto');

class OrderStore {
  constructor() {
    this.orders = new Map();
    this.nextId = 1;
  }

  createOrder(orderData) {
    const { name, address, phone, items, totalAmount } = orderData;
    const orderId = crypto.randomUUID();
    const newOrder = {
      id: orderId,
      name,
      address,
      phone,
      items,
      totalAmount,
      status: ORDER_STATUS.RECEIVED,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.orders.set(orderId, newOrder);
    return newOrder;
  }

  getOrder(id) {
    return this.orders.get(id);
  }

  updateOrderStatus(id, status) {
    const order = this.orders.get(id);
    if (!order) return null;

    if (!Object.values(ORDER_STATUS).includes(status)) {
      throw new Error('Invalid order status');
    }

    order.status = status;
    order.updatedAt = new Date().toISOString();
    this.orders.set(id, order);
    return order;
  }

  getAllOrders() {
    return Array.from(this.orders.values());
  }
}

module.exports = new OrderStore();
