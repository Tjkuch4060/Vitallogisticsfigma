import apiClient from './apiClient.js';
import logger from '../../utils/logger.js';
import { mockOrders } from './mockData.js';

/**
 * Check if mock mode is enabled (runtime check)
 */
const isMockMode = () => process.env.EXTENSIV_MOCK_MODE === 'true';

/**
 * Create order in Extensiv
 */
export const createOrderInExtensiv = async (orderData) => {
  try {
    // Transform our order format to Extensiv format
    const extensivOrder = transformToExtensivOrder(orderData);

    // Mock mode: simulate order creation
    if (isMockMode()) {
      logger.info('🔧 MOCK MODE: Simulating order creation in Extensiv');
      const mockOrderId = `EXT-ORD-${Date.now()}`;

      return {
        extensivOrderId: mockOrderId,
        status: 'paid',
        createdAt: new Date().toISOString(),
        rawResponse: {
          order_id: mockOrderId,
          status: 'paid',
          ...extensivOrder
        }
      };
    }

    // Real API mode
    const response = await apiClient.post('/api/v1/orders', extensivOrder);

    logger.info(`Order created in Extensiv: ${response.data?.order_id}`);

    return {
      extensivOrderId: response.data?.order_id || response.data?.id,
      status: response.data?.status || 'created',
      createdAt: response.data?.created_at || new Date().toISOString(),
      rawResponse: response.data
    };
  } catch (error) {
    logger.error('Error creating order in Extensiv:', error);
    throw error;
  }
};

/**
 * Get orders from Extensiv with filters
 */
export const getOrdersFromExtensiv = async (filters = {}) => {
  try {
    // Mock mode: return mock orders
    if (isMockMode()) {
      logger.info('🔧 MOCK MODE: Returning mock orders data');
      let orders = [...mockOrders];

      // Apply filters to mock data
      if (filters.status) {
        orders = orders.filter(o => o.status === filters.status);
      }
      if (filters.customer) {
        orders = orders.filter(o => o.customer_name === filters.customer);
      }
      if (filters.startDate) {
        orders = orders.filter(o => new Date(o.order_date) >= new Date(filters.startDate));
      }
      if (filters.endDate) {
        orders = orders.filter(o => new Date(o.order_date) <= new Date(filters.endDate));
      }
      if (filters.limit) {
        orders = orders.slice(0, filters.limit);
      }

      const transformedOrders = orders.map(transformFromExtensivOrder);
      logger.info(`Returning ${transformedOrders.length} filtered mock orders`);
      return transformedOrders;
    }

    // Real API mode
    const params = {};

    if (filters.status) params.status = filters.status;
    if (filters.customer) params.customer_id = filters.customer;
    if (filters.startDate) params.start_date = filters.startDate;
    if (filters.endDate) params.end_date = filters.endDate;
    if (filters.limit) params.limit = filters.limit;
    if (filters.offset) params.offset = filters.offset;

    const response = await apiClient.get('/api/v1/orders', params);

    const orders = response.data?.map(transformFromExtensivOrder) || [];

    logger.info(`Fetched ${orders.length} orders from Extensiv`);

    return orders;
  } catch (error) {
    logger.error('Error fetching orders from Extensiv:', error);
    throw error;
  }
};

/**
 * Get single order by ID from Extensiv
 */
export const getOrderByIdFromExtensiv = async (orderId) => {
  try {
    // Mock mode: find in mock data
    if (isMockMode()) {
      logger.info(`🔧 MOCK MODE: Fetching mock order ${orderId}`);
      const mockOrder = mockOrders.find(o => o.order_id === orderId || o.order_number === orderId);

      if (!mockOrder) {
        logger.warn(`Mock order ${orderId} not found`);
        return null;
      }

      return transformFromExtensivOrder(mockOrder);
    }

    // Real API mode
    const response = await apiClient.get(`/api/v1/orders/${orderId}`);

    if (!response.data) {
      return null;
    }

    const order = transformFromExtensivOrder(response.data);

    logger.info(`Fetched order ${orderId} from Extensiv`);

    return order;
  } catch (error) {
    if (error.message.includes('not found')) {
      return null;
    }
    logger.error(`Error fetching order ${orderId} from Extensiv:`, error);
    throw error;
  }
};

/**
 * Get order status from Extensiv
 */
export const getOrderStatusFromExtensiv = async (orderId) => {
  try {
    const response = await apiClient.get(`/api/v1/orders/${orderId}/status`);

    return response.data?.status || null;
  } catch (error) {
    logger.error(`Error fetching order ${orderId} status from Extensiv:`, error);
    throw error;
  }
};

/**
 * Update order in Extensiv
 */
export const updateOrderInExtensiv = async (orderId, updates) => {
  try {
    const response = await apiClient.patch(`/api/v1/orders/${orderId}`, updates);

    logger.info(`Order ${orderId} updated in Extensiv`);

    return response.data;
  } catch (error) {
    logger.error(`Error updating order ${orderId} in Extensiv:`, error);
    throw error;
  }
};

/**
 * Transform our order format to Extensiv format
 */
const transformToExtensivOrder = (orderData) => {
  return {
    customer: {
      name: orderData.customer?.name || orderData.customer?.companyName,
      email: orderData.customer?.email,
      phone: orderData.customer?.phone || null,
      company: orderData.customer?.companyName || null
    },
    shipping_address: {
      name: orderData.shipping?.name || orderData.customer?.name,
      street1: orderData.shipping?.street || orderData.shipping?.address1,
      street2: orderData.shipping?.street2 || null,
      city: orderData.shipping?.city,
      state: orderData.shipping?.state,
      zip: orderData.shipping?.zip || orderData.shipping?.zipCode,
      country: orderData.shipping?.country || 'US'
    },
    line_items: orderData.items?.map(item => ({
      sku: item.sku,
      quantity: item.quantity,
      price: item.price || item.unitPrice,
      description: item.name || item.description
    })) || [],
    order_number: orderData.orderNumber || `ORDER-${Date.now()}`,
    order_date: orderData.orderDate || new Date().toISOString(),
    delivery_method: orderData.deliveryMethod || 'delivery',
    notes: orderData.notes || null,
    metadata: {
      portal_order_id: orderData.id,
      delivery_zone: orderData.deliveryZone,
      total_amount: orderData.total,
      payment_status: orderData.paymentStatus || 'paid'
    }
  };
};

/**
 * Transform Extensiv order format to our internal format
 */
const transformFromExtensivOrder = (extensivOrder) => {
  return {
    id: extensivOrder.id || extensivOrder.order_id,
    orderNumber: extensivOrder.order_number,
    customer: {
      name: extensivOrder.customer?.name,
      email: extensivOrder.customer?.email,
      phone: extensivOrder.customer?.phone,
      companyName: extensivOrder.customer?.company
    },
    items: extensivOrder.line_items?.map(item => ({
      sku: item.sku,
      name: item.description || item.name,
      quantity: item.quantity,
      price: item.price,
      total: item.quantity * item.price
    })) || [],
    status: mapExtensivStatusToInternal(extensivOrder.status),
    total: extensivOrder.total_amount || calculateTotal(extensivOrder.line_items),
    date: extensivOrder.order_date || extensivOrder.created_at,
    shipping: {
      name: extensivOrder.shipping_address?.name,
      street: extensivOrder.shipping_address?.street1,
      street2: extensivOrder.shipping_address?.street2,
      city: extensivOrder.shipping_address?.city,
      state: extensivOrder.shipping_address?.state,
      zip: extensivOrder.shipping_address?.zip,
      country: extensivOrder.shipping_address?.country || 'US'
    },
    deliveryMethod: extensivOrder.delivery_method || 'delivery',
    trackingNumber: extensivOrder.tracking_number || null,
    _extensivData: {
      originalId: extensivOrder.id,
      warehouseId: extensivOrder.warehouse_id,
      lastUpdated: extensivOrder.updated_at || new Date().toISOString()
    }
  };
};

/**
 * Map Extensiv status to our internal status
 */
const mapExtensivStatusToInternal = (extensivStatus) => {
  const statusMap = {
    'created': 'paid',
    'pending': 'paid',
    'picking': 'picking',
    'picked': 'picked',
    'packing': 'packing',
    'packed': 'packed',
    'shipped': 'shipped',
    'delivered': 'delivered',
    'cancelled': 'cancelled',
    'on_hold': 'on_hold'
  };

  return statusMap[extensivStatus?.toLowerCase()] || extensivStatus;
};

/**
 * Calculate order total from line items
 */
const calculateTotal = (lineItems = []) => {
  return lineItems.reduce((total, item) => {
    return total + (item.quantity * item.price);
  }, 0);
};

export default {
  createOrderInExtensiv,
  getOrdersFromExtensiv,
  getOrderByIdFromExtensiv,
  getOrderStatusFromExtensiv,
  updateOrderInExtensiv
};
