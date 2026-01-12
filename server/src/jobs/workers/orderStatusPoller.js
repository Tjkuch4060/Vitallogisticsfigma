import cron from 'node-cron';
import { getOrdersFromExtensiv, getOrderStatusFromExtensiv } from '../../services/extensiv/orders.js';
import logger from '../../utils/logger.js';
import { captureException } from '../../utils/sentry.js';

const POLL_INTERVAL = parseInt(process.env.ORDER_STATUS_POLL_INTERVAL || '5', 10); // minutes

let isRunning = false;
let lastPollTime = null;
let pollTask = null;

// Statuses to monitor
const MONITORED_STATUSES = ['paid', 'picking', 'packed', 'shipped'];

/**
 * Poll order statuses from Extensiv
 */
const pollOrderStatuses = async () => {
  if (isRunning) {
    logger.warn('Order status polling already running, skipping this cycle');
    return;
  }

  isRunning = true;
  const startTime = Date.now();

  try {
    logger.info('Starting order status polling...');

    // TODO: Get orders from database that need status updates
    // For now, we'll fetch from Extensiv directly
    const orders = await getOrdersFromExtensiv({
      status: MONITORED_STATUSES.join(','),
      limit: 100
    });

    logger.info(`Polling ${orders.length} orders for status updates`);

    let updatedCount = 0;

    for (const order of orders) {
      try {
        const currentStatus = await getOrderStatusFromExtensiv(order.id);

        // TODO: Check if status changed in database
        // If changed, update database and trigger notifications

        // Mock status change detection
        if (currentStatus !== order.status) {
          logger.info(`Order ${order.id} status changed: ${order.status} → ${currentStatus}`);

          // TODO: Update order in database
          // await updateOrderStatus(order.id, currentStatus);

          // Handle specific status changes
          await handleStatusChange(order.id, order.status, currentStatus, order);

          updatedCount++;
        }
      } catch (error) {
        logger.error(`Error polling status for order ${order.id}:`, error);
        // Continue with next order
      }
    }

    const duration = Date.now() - startTime;

    logger.info(`Order status polling completed`, {
      ordersPolled: orders.length,
      ordersUpdated: updatedCount,
      duration: `${duration}ms`
    });

    lastPollTime = new Date().toISOString();

    return {
      ordersPolled: orders.length,
      ordersUpdated: updatedCount,
      polledAt: lastPollTime
    };
  } catch (error) {
    logger.error('Order status polling failed:', error);

    captureException(error, {
      job: 'orderStatusPoller',
      lastPollTime,
      duration: Date.now() - startTime
    });

    // Don't throw - we want the cron to continue
  } finally {
    isRunning = false;
  }
};

/**
 * Handle status change and trigger appropriate actions
 */
const handleStatusChange = async (orderId, oldStatus, newStatus, order) => {
  logger.info(`Handling status change for order ${orderId}: ${oldStatus} → ${newStatus}`);

  try {
    switch (newStatus) {
      case 'packed':
        // Order is ready for pickup/delivery
        logger.info(`Order ${orderId} is packed and ready`);

        // TODO: Send notification to customer
        // if (order.deliveryMethod === 'pickup') {
        //   await sendPickupReadyNotification(order);
        // } else {
        //   await scheduleDelivery(order);
        // }
        break;

      case 'shipped':
        // Order has been shipped
        logger.info(`Order ${orderId} has been shipped`);

        // TODO: Send tracking notification
        // await sendShippingNotification(order);
        break;

      case 'delivered':
        // Order has been delivered
        logger.info(`Order ${orderId} has been delivered`);

        // TODO: Send delivery confirmation
        // await sendDeliveryConfirmation(order);
        break;

      case 'cancelled':
        // Order was cancelled
        logger.warn(`Order ${orderId} was cancelled`);

        // TODO: Handle cancellation
        // await handleOrderCancellation(order);
        break;

      default:
        logger.debug(`No special handling for status: ${newStatus}`);
    }
  } catch (error) {
    logger.error(`Error handling status change for order ${orderId}:`, error);
    captureException(error, {
      orderId,
      oldStatus,
      newStatus
    });
  }
};

/**
 * Start order status polling cron job
 */
export const startOrderStatusPoller = () => {
  // Schedule polling every N minutes
  const cronExpression = `*/${POLL_INTERVAL} * * * *`;

  pollTask = cron.schedule(cronExpression, pollOrderStatuses, {
    scheduled: true,
    timezone: 'America/Chicago' // Adjust to your timezone
  });

  logger.info(`Order status polling scheduled: every ${POLL_INTERVAL} minutes`);

  // Run initial poll after 10 seconds
  setTimeout(() => {
    pollOrderStatuses();
  }, 10000);

  return pollTask;
};

/**
 * Stop order status polling
 */
export const stopOrderStatusPoller = () => {
  if (pollTask) {
    pollTask.stop();
    logger.info('Order status polling stopped');
  }
};

/**
 * Get polling status
 */
export const getPollingStatus = () => {
  return {
    isRunning,
    lastPollTime,
    nextPollIn: POLL_INTERVAL,
    interval: `${POLL_INTERVAL} minutes`,
    monitoredStatuses: MONITORED_STATUSES
  };
};

/**
 * Manually trigger polling
 */
export const triggerManualPoll = async () => {
  logger.info('Manual order status poll triggered');
  return await pollOrderStatuses();
};

export default {
  startOrderStatusPoller,
  stopOrderStatusPoller,
  getPollingStatus,
  triggerManualPoll
};
