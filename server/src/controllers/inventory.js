import { syncInventoryFromExtensiv } from '../services/extensiv/inventory.js';
import { cacheGet } from '../config/redis.js';
import logger from '../utils/logger.js';

export const getInventory = async (req, res) => {
  try {
    // Get inventory from cache
    const inventory = await cacheGet('inventory:all');

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Inventory not yet synced. Please wait for the next sync cycle or trigger manual sync.'
      });
    }

    res.json({
      success: true,
      data: inventory,
      lastSync: inventory.lastSync || null
    });
  } catch (error) {
    logger.error('Error fetching inventory:', error);
    throw error;
  }
};

export const syncInventory = async (req, res) => {
  try {
    logger.info('Manual inventory sync triggered');

    const result = await syncInventoryFromExtensiv();

    res.json({
      success: true,
      message: 'Inventory synced successfully',
      data: {
        productsUpdated: result.count,
        syncedAt: result.syncedAt
      }
    });
  } catch (error) {
    logger.error('Error syncing inventory:', error);
    throw error;
  }
};
