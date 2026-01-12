import apiClient from './apiClient.js';
import { cacheSet } from '../../config/redis.js';
import logger from '../../utils/logger.js';
import { mockInventory } from './mockData.js';

const CACHE_TTL = parseInt(process.env.CACHE_TTL || '900', 10); // 15 minutes default

/**
 * Check if mock mode is enabled (runtime check)
 */
const isMockMode = () => process.env.EXTENSIV_MOCK_MODE === 'true';

/**
 * Sync inventory from Extensiv
 * This fetches all products with their current inventory levels
 */
export const syncInventoryFromExtensiv = async () => {
  try {
    logger.info('Starting inventory sync from Extensiv...');

    let inventoryData;

    // Mock mode: use mock data
    if (isMockMode()) {
      logger.info('🔧 MOCK MODE: Using mock inventory data');
      inventoryData = mockInventory;
    } else {
      // Real API mode: fetch from Extensiv
      const response = await apiClient.get('/api/v1/inventory');

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid inventory response from Extensiv');
      }

      inventoryData = response.data;
    }

    // Transform inventory data
    const inventory = inventoryData.map(item => transformInventoryItem(item));

    const syncedAt = new Date().toISOString();

    // Cache the full inventory
    await cacheSet('inventory:all', {
      items: inventory,
      lastSync: syncedAt,
      count: inventory.length,
      source: isMockMode() ? 'mock' : 'extensiv'
    }, CACHE_TTL);

    // Also cache individual items by SKU for quick lookups
    for (const item of inventory) {
      await cacheSet(`inventory:sku:${item.sku}`, item, CACHE_TTL);
    }

    logger.info(`Inventory sync completed: ${inventory.length} items synced ${isMockMode() ? '(MOCK)' : ''}`);

    return {
      count: inventory.length,
      syncedAt,
      source: isMockMode() ? 'mock' : 'extensiv'
    };
  } catch (error) {
    logger.error('Error syncing inventory from Extensiv:', error);
    throw error;
  }
};

/**
 * Get inventory for a specific SKU
 */
export const getInventoryBySku = async (sku) => {
  try {
    let inventoryData;

    // Mock mode: find in mock data
    if (isMockMode()) {
      logger.info(`🔧 MOCK MODE: Fetching mock inventory for SKU ${sku}`);
      inventoryData = mockInventory.find(item => item.sku === sku);

      if (!inventoryData) {
        logger.warn(`Mock inventory for SKU ${sku} not found`);
        return null;
      }
    } else {
      // Real API mode
      const response = await apiClient.get(`/api/v1/inventory/${sku}`);

      if (!response.data) {
        return null;
      }

      inventoryData = response.data;
    }

    const inventory = transformInventoryItem(inventoryData);

    // Cache it
    await cacheSet(`inventory:sku:${sku}`, inventory, CACHE_TTL);

    return inventory;
  } catch (error) {
    if (error.message.includes('not found')) {
      return null;
    }
    logger.error(`Error fetching inventory for SKU ${sku}:`, error);
    throw error;
  }
};

/**
 * Update inventory in Extensiv (adjust stock levels)
 */
export const updateInventoryInExtensiv = async (sku, quantity, reason = 'adjustment') => {
  try {
    const response = await apiClient.post(`/api/v1/inventory/${sku}/adjust`, {
      quantity,
      reason,
      adjusted_at: new Date().toISOString()
    });

    logger.info(`Inventory adjusted for SKU ${sku}: ${quantity} (${reason})`);

    // Invalidate cache for this SKU
    await cacheSet(`inventory:sku:${sku}`, null);

    return transformInventoryItem(response.data);
  } catch (error) {
    logger.error(`Error updating inventory for SKU ${sku}:`, error);
    throw error;
  }
};

/**
 * Get low stock items
 */
export const getLowStockItems = async (threshold = 10) => {
  try {
    const response = await apiClient.get('/api/v1/inventory', {
      low_stock: true,
      threshold
    });

    const items = response.data?.map(transformInventoryItem) || [];

    logger.info(`Found ${items.length} low stock items (threshold: ${threshold})`);

    return items;
  } catch (error) {
    logger.error('Error fetching low stock items:', error);
    throw error;
  }
};

/**
 * Transform Extensiv inventory item to our format
 */
const transformInventoryItem = (extensivItem) => {
  return {
    sku: extensivItem.sku,
    productId: extensivItem.product_id,
    name: extensivItem.product_name || extensivItem.description,
    brand: extensivItem.brand || extensivItem.manufacturer,
    quantityAvailable: parseInt(extensivItem.quantity_available || 0, 10),
    quantityOnHand: parseInt(extensivItem.quantity_on_hand || 0, 10),
    quantityAllocated: parseInt(extensivItem.quantity_allocated || 0, 10),
    quantityOnOrder: parseInt(extensivItem.quantity_on_order || 0, 10),
    reorderPoint: parseInt(extensivItem.reorder_point || 0, 10),
    reorderQuantity: parseInt(extensivItem.reorder_quantity || 0, 10),
    warehouseLocation: extensivItem.warehouse_location || null,
    batchNumber: extensivItem.batch_number || extensivItem.lot_number || null,
    expirationDate: extensivItem.expiration_date || null,
    lastUpdated: extensivItem.updated_at || new Date().toISOString(),
    // Additional metadata
    isLowStock: (extensivItem.quantity_available || 0) <= (extensivItem.reorder_point || 10),
    isOutOfStock: (extensivItem.quantity_available || 0) === 0,
    _extensivData: {
      warehouseId: extensivItem.warehouse_id,
      locationId: extensivItem.location_id
    }
  };
};

export default {
  syncInventoryFromExtensiv,
  getInventoryBySku,
  updateInventoryInExtensiv,
  getLowStockItems
};
