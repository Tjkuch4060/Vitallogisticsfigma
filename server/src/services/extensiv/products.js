import apiClient from './apiClient.js';
import logger from '../../utils/logger.js';
import { mockProducts } from './mockData.js';

const MOCK_MODE = process.env.EXTENSIV_MOCK_MODE === 'true';

/**
 * Get all products from Extensiv with optional filters
 */
export const getProductsFromExtensiv = async (filters = {}) => {
  try {
    // Mock mode: return mock data
    if (MOCK_MODE) {
      logger.info('🔧 MOCK MODE: Returning mock products data');
      let products = mockProducts.map(transformProduct);

      // Apply filters to mock data
      if (filters.category) {
        products = products.filter(p => p.category === filters.category);
      }
      if (filters.brand) {
        products = products.filter(p => p.brand === filters.brand);
      }
      if (filters.inStock) {
        products = products.filter(p => p.stock > 0);
      }
      if (filters.minPrice) {
        products = products.filter(p => p.price >= parseFloat(filters.minPrice));
      }
      if (filters.maxPrice) {
        products = products.filter(p => p.price <= parseFloat(filters.maxPrice));
      }

      logger.info(`Returning ${products.length} filtered mock products`);
      return products;
    }

    // Real API mode
    const params = {};

    if (filters.category) params.category = filters.category;
    if (filters.brand) params.brand = filters.brand;
    if (filters.inStock) params.in_stock = filters.inStock;
    if (filters.minPrice) params.min_price = filters.minPrice;
    if (filters.maxPrice) params.max_price = filters.maxPrice;

    const response = await apiClient.get('/api/v1/products', params);

    // Transform Extensiv data to our format
    const products = response.data?.map(transformProduct) || [];

    logger.info(`Fetched ${products.length} products from Extensiv`);

    return products;
  } catch (error) {
    logger.error('Error fetching products from Extensiv:', error);
    throw error;
  }
};

/**
 * Get single product by ID from Extensiv
 */
export const getProductByIdFromExtensiv = async (productId) => {
  try {
    // Mock mode: return mock data
    if (MOCK_MODE) {
      logger.info(`🔧 MOCK MODE: Fetching mock product ${productId}`);
      const mockProduct = mockProducts.find(p => p.product_id === productId || p.sku === productId);

      if (!mockProduct) {
        logger.warn(`Mock product ${productId} not found`);
        return null;
      }

      return transformProduct(mockProduct);
    }

    // Real API mode
    const response = await apiClient.get(`/api/v1/products/${productId}`);

    if (!response.data) {
      return null;
    }

    const product = transformProduct(response.data);

    logger.info(`Fetched product ${productId} from Extensiv`);

    return product;
  } catch (error) {
    if (error.message.includes('not found')) {
      return null;
    }
    logger.error(`Error fetching product ${productId} from Extensiv:`, error);
    throw error;
  }
};

/**
 * Transform Extensiv product data to our internal format
 */
const transformProduct = (extensivProduct) => {
  return {
    id: extensivProduct.id || extensivProduct.product_id,
    sku: extensivProduct.sku,
    name: extensivProduct.name || extensivProduct.description,
    brand: extensivProduct.brand || extensivProduct.manufacturer,
    category: extensivProduct.category || 'Uncategorized',
    price: parseFloat(extensivProduct.price || extensivProduct.unit_price || 0),
    stock: parseInt(extensivProduct.quantity_available || extensivProduct.stock || 0, 10),
    thc: parseFloat(extensivProduct.thc_content || extensivProduct.thc_mg || 0),
    description: extensivProduct.long_description || extensivProduct.description || '',
    batchNumber: extensivProduct.batch_number || extensivProduct.lot_number || null,
    coaLink: extensivProduct.coa_url || extensivProduct.certificate_url || null,
    image: extensivProduct.image_url || extensivProduct.image || null,
    rating: extensivProduct.rating || 0,
    // Keep original Extensiv data for reference
    _extensivData: {
      originalId: extensivProduct.id,
      lastUpdated: extensivProduct.updated_at || new Date().toISOString()
    }
  };
};

/**
 * Get product inventory levels
 */
export const getProductInventory = async (sku) => {
  try {
    const response = await apiClient.get(`/api/v1/inventory/${sku}`);

    return {
      sku,
      quantityAvailable: parseInt(response.data?.quantity_available || 0, 10),
      quantityOnHand: parseInt(response.data?.quantity_on_hand || 0, 10),
      quantityAllocated: parseInt(response.data?.quantity_allocated || 0, 10),
      lastUpdated: response.data?.updated_at || new Date().toISOString()
    };
  } catch (error) {
    logger.error(`Error fetching inventory for SKU ${sku}:`, error);
    throw error;
  }
};

export default {
  getProductsFromExtensiv,
  getProductByIdFromExtensiv,
  getProductInventory
};
