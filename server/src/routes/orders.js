import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus
} from '../controllers/orders.js';

const router = express.Router();

// POST /api/v1/orders - Create new order
router.post('/', asyncHandler(createOrder));

// GET /api/v1/orders - Get all orders
router.get('/', asyncHandler(getOrders));

// GET /api/v1/orders/:id - Get order by ID
router.get('/:id', asyncHandler(getOrderById));

// PATCH /api/v1/orders/:id/status - Update order status
router.patch('/:id/status', asyncHandler(updateOrderStatus));

export default router;
