import Queue from 'bull';
import { createOrderInExtensiv } from '../../services/extensiv/orders.js';
import logger from '../../utils/logger.js';
import { captureException } from '../../utils/sentry.js';

// Create order queue
const orderQueue = new Queue('order-processing', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined
  },
  defaultJobOptions: {
    attempts: 5, // Retry up to 5 times
    backoff: {
      type: 'exponential',
      delay: 2000 // Start with 2 seconds, doubles each retry
    },
    removeOnComplete: 100, // Keep last 100 completed jobs
    removeOnFail: 500 // Keep last 500 failed jobs
  }
});

// Process order creation jobs
orderQueue.process('createOrder', async (job) => {
  const { orderData, createdAt } = job.data;

  logger.info(`Processing order creation job ${job.id}`, {
    orderId: orderData.id,
    customer: orderData.customer?.email
  });

  try {
    // Create order in Extensiv
    const result = await createOrderInExtensiv(orderData);

    logger.info(`Order successfully created in Extensiv: ${result.extensivOrderId}`);

    // TODO: Update order in database with extensivOrderId
    // await updateOrderInDatabase(orderData.id, {
    //   extensivOrderId: result.extensivOrderId,
    //   status: 'exported'
    // });

    // TODO: Send confirmation email to customer
    // await sendOrderConfirmationEmail(orderData.customer.email, result);

    return {
      success: true,
      extensivOrderId: result.extensivOrderId,
      createdAt: result.createdAt
    };
  } catch (error) {
    logger.error(`Error processing order job ${job.id}:`, error);

    // Capture in Sentry
    captureException(error, {
      jobId: job.id,
      orderId: orderData.id,
      attemptsMade: job.attemptsMade
    });

    // Determine if we should retry
    if (error.message.includes('Rate limit') || error.message.includes('unavailable')) {
      // Retriable errors
      throw error;
    } else if (error.message.includes('Bad request')) {
      // Non-retriable errors - log and mark as failed
      logger.error('Order creation failed with bad request - will not retry', {
        jobId: job.id,
        error: error.message
      });

      // TODO: Notify admin about failed order
      // await notifyAdminOrderFailed(orderData, error);

      throw new Error(`Non-retriable error: ${error.message}`);
    } else {
      // Other errors - retry
      throw error;
    }
  }
});

// Job event handlers
orderQueue.on('completed', (job, result) => {
  logger.info(`Order job ${job.id} completed successfully`, result);
});

orderQueue.on('failed', (job, err) => {
  logger.error(`Order job ${job.id} failed after ${job.attemptsMade} attempts:`, err);

  // If all retries exhausted, notify admin
  if (job.attemptsMade >= job.opts.attempts) {
    logger.error(`Order job ${job.id} exhausted all retry attempts`, {
      jobData: job.data,
      error: err.message
    });

    // TODO: Send admin alert
    // notifyAdminOrderFailed(job.data.orderData, err);
  }
});

orderQueue.on('stalled', (job) => {
  logger.warn(`Order job ${job.id} has stalled`);
});

// Helper function to add jobs to queue
export const addJobToQueue = async (jobType, data) => {
  try {
    const job = await orderQueue.add(jobType, data);
    logger.info(`Job ${job.id} added to order queue (type: ${jobType})`);
    return job;
  } catch (error) {
    logger.error('Error adding job to queue:', error);
    throw error;
  }
};

// Get queue stats
export const getQueueStats = async () => {
  const [waiting, active, completed, failed, delayed] = await Promise.all([
    orderQueue.getWaitingCount(),
    orderQueue.getActiveCount(),
    orderQueue.getCompletedCount(),
    orderQueue.getFailedCount(),
    orderQueue.getDelayedCount()
  ]);

  return {
    waiting,
    active,
    completed,
    failed,
    delayed,
    total: waiting + active + completed + failed + delayed
  };
};

// Clean old jobs
export const cleanQueue = async (grace = 24 * 3600 * 1000) => {
  // Clean jobs older than grace period (default: 24 hours)
  await orderQueue.clean(grace, 'completed');
  await orderQueue.clean(grace, 'failed');
  logger.info(`Order queue cleaned (grace: ${grace}ms)`);
};

export default orderQueue;
