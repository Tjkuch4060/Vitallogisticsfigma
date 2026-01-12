import express from 'express';
import productsRouter from './products.js';
import ordersRouter from './orders.js';
import inventoryRouter from './inventory.js';

const router = express.Router();

// API version prefix
router.use('/v1/products', productsRouter);
router.use('/v1/orders', ordersRouter);
router.use('/v1/inventory', inventoryRouter);

// API root endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'VitalLogistics API',
    version: '1.0.0',
    endpoints: {
      products: '/api/v1/products',
      orders: '/api/v1/orders',
      inventory: '/api/v1/inventory',
      health: '/health'
    }
  });
});

export default router;
