import { startInventorySync } from './workers/inventorySync.js';
import { startOrderStatusPoller } from './workers/orderStatusPoller.js';
import orderQueue from './queues/orderQueue.js';
import logger from '../utils/logger.js';

/**
 * Start all background jobs
 */
export const startJobs = async () => {
  try {
    logger.info('Starting background jobs...');

    // Start inventory sync cron job
    startInventorySync();

    // Start order status polling cron job
    startOrderStatusPoller();

    // Order queue is already listening, just log it
    logger.info('Order processing queue initialized');

    logger.info('✅ All background jobs started successfully');
  } catch (error) {
    logger.error('Error starting background jobs:', error);
    throw error;
  }
};

/**
 * Stop all background jobs (for graceful shutdown)
 */
export const stopJobs = async () => {
  logger.info('Stopping background jobs...');

  try {
    const { stopInventorySync } = await import('./workers/inventorySync.js');
    const { stopOrderStatusPoller } = await import('./workers/orderStatusPoller.js');

    stopInventorySync();
    stopOrderStatusPoller();

    // Close order queue
    await orderQueue.close();

    logger.info('All background jobs stopped');
  } catch (error) {
    logger.error('Error stopping background jobs:', error);
  }
};

export default {
  startJobs,
  stopJobs
};
