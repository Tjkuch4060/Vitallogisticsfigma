import { getProductsFromExtensiv, getProductByIdFromExtensiv } from '../services/extensiv/products.js';
import { cacheGet, cacheSet } from '../config/redis.js';
import logger from '../utils/logger.js';

const CACHE_TTL = parseInt(process.env.CACHE_TTL || '900', 10); // 15 minutes default

export const getProducts = async (req, res) => {
  const { category, brand, inStock, minPrice, maxPrice } = req.query;

  try {
    // Try to get from cache first
    const cacheKey = `products:${JSON.stringify(req.query)}`;
    const cached = await cacheGet(cacheKey);

    if (cached) {
      logger.info('Products retrieved from cache');
      return res.json({
        success: true,
        data: cached,
        source: 'cache'
      });
    }

    // Fetch from Extensiv
    const products = await getProductsFromExtensiv({
      category,
      brand,
      inStock,
      minPrice,
      maxPrice
    });

    // Cache the results
    await cacheSet(cacheKey, products, CACHE_TTL);

    logger.info(`Products retrieved from Extensiv: ${products.length} items`);

    res.json({
      success: true,
      data: products,
      source: 'extensiv'
    });
  } catch (error) {
    logger.error('Error fetching products:', error);

    // Try to return stale cache if available
    const cacheKey = `products:${JSON.stringify(req.query)}`;
    const staleCache = await cacheGet(cacheKey);

    if (staleCache) {
      logger.warn('Returning stale cache due to API error');
      return res.json({
        success: true,
        data: staleCache,
        source: 'stale_cache',
        warning: 'Data may be outdated due to API error'
      });
    }

    throw error;
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    // Try cache first
    const cacheKey = `product:${id}`;
    const cached = await cacheGet(cacheKey);

    if (cached) {
      logger.info(`Product ${id} retrieved from cache`);
      return res.json({
        success: true,
        data: cached,
        source: 'cache'
      });
    }

    // Fetch from Extensiv
    const product = await getProductByIdFromExtensiv(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Cache the result
    await cacheSet(cacheKey, product, CACHE_TTL);

    logger.info(`Product ${id} retrieved from Extensiv`);

    res.json({
      success: true,
      data: product,
      source: 'extensiv'
    });
  } catch (error) {
    logger.error(`Error fetching product ${id}:`, error);
    throw error;
  }
};
