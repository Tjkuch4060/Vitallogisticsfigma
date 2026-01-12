import { createClient } from 'redis';
import logger from '../utils/logger.js';

const redisConfig = {
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10)
  },
  password: process.env.REDIS_PASSWORD || undefined,
  database: parseInt(process.env.REDIS_DB || '0', 10)
};

// Create Redis client
const redisClient = createClient(redisConfig);

// Error handling
redisClient.on('error', (error) => {
  logger.error('Redis Client Error:', error);
});

redisClient.on('connect', () => {
  logger.info('Redis client connecting...');
});

redisClient.on('ready', () => {
  logger.info('Redis client ready');
});

redisClient.on('reconnecting', () => {
  logger.warn('Redis client reconnecting...');
});

redisClient.on('end', () => {
  logger.info('Redis client connection ended');
});

// Helper functions for cache operations
export const cacheGet = async (key) => {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.error(`Cache GET error for key ${key}:`, error);
    return null;
  }
};

export const cacheSet = async (key, value, ttl = null) => {
  try {
    const serialized = JSON.stringify(value);
    if (ttl) {
      await redisClient.setEx(key, ttl, serialized);
    } else {
      await redisClient.set(key, serialized);
    }
    return true;
  } catch (error) {
    logger.error(`Cache SET error for key ${key}:`, error);
    return false;
  }
};

export const cacheDel = async (key) => {
  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    logger.error(`Cache DEL error for key ${key}:`, error);
    return false;
  }
};

export const cacheExists = async (key) => {
  try {
    return await redisClient.exists(key) === 1;
  } catch (error) {
    logger.error(`Cache EXISTS error for key ${key}:`, error);
    return false;
  }
};

export { redisClient };
