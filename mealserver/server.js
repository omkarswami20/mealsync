const fastify = require('./src/app');

// Start Server
const start = async () => {
  try {
    const port = process.env.PORT || 3001;
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`Mealserver (MealSync Backend) is listening on port ${port}`);
    // console.log(`- GET /api/menu`);
    // console.log(`- POST /api/orders`);
    // console.log(`- GET /api/orders/:id`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
