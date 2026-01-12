import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { getInventory, syncInventory } from '../controllers/inventory.js';

const router = express.Router();

// GET /api/v1/inventory - Get current inventory levels
router.get('/', asyncHandler(getInventory));

// POST /api/v1/inventory/sync - Manually trigger inventory sync
router.post('/sync', asyncHandler(syncInventory));

export default router;
