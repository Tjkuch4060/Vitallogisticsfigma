import {
  createOrderInExtensiv,
  getOrdersFromExtensiv,
  getOrderByIdFromExtensiv,
  getOrderStatusFromExtensiv
} from '../services/extensiv/orders.js';
import { addJobToQueue } from '../jobs/queues/orderQueue.js';
import logger from '../utils/logger.js';
import { ApiError } from '../middleware/errorHandler.js';

export const createOrder = async (req, res) => {
  const orderData = req.body;

  // Basic validation
  if (!orderData.items || orderData.items.length === 0) {
    throw new ApiError(400, 'Order must contain at least one item');
  }

  if (!orderData.customer) {
    throw new ApiError(400, 'Customer information is required');
  }

  try {
    // TODO: In production, verify payment first (Stripe webhook)
    // For now, we'll assume payment is confirmed

    // Add order to queue for Extensiv export
    const job = await addJobToQueue('createOrder', {
      orderData,
      createdAt: new Date().toISOString()
    });

    logger.info(`Order queued for Extensiv export: Job ${job.id}`);

    // Return immediate response
    res.status(202).json({
      success: true,
      message: 'Order received and queued for processing',
      jobId: job.id,
      order: {
        status: 'paid',
        queuedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('Error creating order:', error);
    throw new ApiError(500, 'Failed to create order');
  }
};

export const getOrders = async (req, res) => {
  const { status, customer, startDate, endDate, limit = 50, offset = 0 } = req.query;

  try {
    const orders = await getOrdersFromExtensiv({
      status,
      customer,
      startDate,
      endDate,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10)
    });

    res.json({
      success: true,
      data: orders,
      pagination: {
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10),
        total: orders.length
      }
    });
  } catch (error) {
    logger.error('Error fetching orders:', error);
    throw new ApiError(500, 'Failed to fetch orders');
  }
};

export const getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await getOrderByIdFromExtensiv(id);

    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    logger.error(`Error fetching order ${id}:`, error);
    throw new ApiError(500, 'Failed to fetch order');
  }
};

export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    throw new ApiError(400, 'Status is required');
  }

  try {
    // Get current status from Extensiv
    const currentStatus = await getOrderStatusFromExtensiv(id);

    if (!currentStatus) {
      throw new ApiError(404, 'Order not found');
    }

    logger.info(`Order ${id} status updated from ${currentStatus} to ${status}`);

    res.json({
      success: true,
      message: 'Order status updated',
      data: {
        orderId: id,
        previousStatus: currentStatus,
        newStatus: status,
        updatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    logger.error(`Error updating order ${id} status:`, error);
    throw new ApiError(500, 'Failed to update order status');
  }
};
