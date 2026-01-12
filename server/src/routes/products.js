import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { getProducts, getProductById } from '../controllers/products.js';

const router = express.Router();

// GET /api/v1/products - Get all products
router.get('/', asyncHandler(getProducts));

// GET /api/v1/products/:id - Get product by ID
router.get('/:id', asyncHandler(getProductById));

export default router;
