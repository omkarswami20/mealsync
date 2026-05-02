const { menuItems } = require('../data/menu');

class MenuService {
  async getAllItems() {
    return menuItems;
  }

  async getItemById(id) {
    return menuItems.find(item => item.id === id);
  }
}

module.exports = new MenuService();
