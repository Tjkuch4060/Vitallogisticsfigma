import cron from 'node-cron';
import { syncInventoryFromExtensiv } from '../../services/extensiv/inventory.js';
import logger from '../../utils/logger.js';
import { captureException } from '../../utils/sentry.js';

const SYNC_INTERVAL = parseInt(process.env.INVENTORY_SYNC_INTERVAL || '10', 10); // minutes

let isRunning = false;
let lastSyncTime = null;
let syncTask = null;

/**
 * Perform inventory sync
 */
const performSync = async () => {
  if (isRunning) {
    logger.warn('Inventory sync already running, skipping this cycle');
    return;
  }

  isRunning = true;
  const startTime = Date.now();

  try {
    logger.info('Starting inventory sync job...');

    const result = await syncInventoryFromExtensiv();

    const duration = Date.now() - startTime;

    logger.info(`Inventory sync completed successfully`, {
      productsUpdated: result.count,
      duration: `${duration}ms`,
      syncedAt: result.syncedAt
    });

    lastSyncTime = result.syncedAt;

    return result;
  } catch (error) {
    logger.error('Inventory sync failed:', error);

    captureException(error, {
      job: 'inventorySync',
      lastSyncTime,
      duration: Date.now() - startTime
    });

    // Don't throw - we want the cron to continue
    // Next sync will retry
  } finally {
    isRunning = false;
  }
};

/**
 * Start inventory sync cron job
 */
export const startInventorySync = () => {
  // Schedule inventory sync every N minutes
  const cronExpression = `*/${SYNC_INTERVAL} * * * *`;

  syncTask = cron.schedule(cronExpression, performSync, {
    scheduled: true,
    timezone: 'America/Chicago' // Adjust to your timezone
  });

  logger.info(`Inventory sync scheduled: every ${SYNC_INTERVAL} minutes`);

  // Run initial sync immediately
  setTimeout(() => {
    performSync();
  }, 5000); // Wait 5 seconds after startup

  return syncTask;
};

/**
 * Stop inventory sync
 */
export const stopInventorySync = () => {
  if (syncTask) {
    syncTask.stop();
    logger.info('Inventory sync stopped');
  }
};

/**
 * Get sync status
 */
export const getSyncStatus = () => {
  return {
    isRunning,
    lastSyncTime,
    nextSyncIn: SYNC_INTERVAL,
    interval: `${SYNC_INTERVAL} minutes`
  };
};

/**
 * Manually trigger sync
 */
export const triggerManualSync = async () => {
  logger.info('Manual inventory sync triggered');
  return await performSync();
};

export default {
  startInventorySync,
  stopInventorySync,
  getSyncStatus,
  triggerManualSync
};
