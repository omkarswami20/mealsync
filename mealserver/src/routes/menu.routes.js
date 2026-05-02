const menuService = require('../services/menu.service');

async function menuRoutes(fastify, options) {
  const menuSchema = {
    response: {
      200: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            category: { type: 'string' },
            image: { type: 'string' }
          }
        }
      }
    }
  };

  fastify.get('/menu', { schema: menuSchema }, async (request, reply) => {
    return await menuService.getAllItems();
  });
}

module.exports = menuRoutes;
