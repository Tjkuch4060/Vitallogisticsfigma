/**
 * Application Constants
 * Centralized configuration values to avoid magic numbers and strings
 */

// ============================================================================
// DELIVERY ZONES
// ============================================================================

export const ZIP_TO_ZONE_MAPPINGS = [
  { minZip: 55400, maxZip: 55499, zoneId: 1, name: 'Metro Core' },
  { minZip: 55300, maxZip: 55399, zoneId: 2, name: 'Greater Metro' },
  // Default to regional zone for all other ZIP codes
  { minZip: 0, maxZip: 99999, zoneId: 3, name: 'Regional' },
] as const;

export const DELIVERY_PROCESSING_DAYS = 1;

// ============================================================================
// STOCK THRESHOLDS
// ============================================================================

export const STOCK_LEVELS = {
  OUT_OF_STOCK: 0,
  LOW_STOCK_THRESHOLD: 20,
} as const;

// ============================================================================
// LICENSE STATUS
// ============================================================================

export const LICENSE_WARNING_THRESHOLDS = {
  CRITICAL: 7, // Days remaining for critical warning
  WARNING: 30, // Days remaining for warning
} as const;

// ============================================================================
// PRICE FORMATTING
// ============================================================================

export const CURRENCY_CONFIG = {
  locale: 'en-US',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
} as const;

// ============================================================================
// PAGINATION
// ============================================================================

export const PAGINATION_DEFAULTS = {
  PRODUCTS_PER_PAGE: 12,
  ORDERS_PER_PAGE: 10,
  ITEMS_PER_PAGE: 20,
} as const;

// ============================================================================
// VALIDATION
// ============================================================================

export const VALIDATION_RULES = {
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  MIN_COMPANY_LENGTH: 2,
  MAX_COMPANY_LENGTH: 200,
  PHONE_REGEX: /^\d{10}$/,
  ZIP_REGEX: /^\d{5}$/,
  STATE_LENGTH: 2,
  MAX_DESCRIPTION_LENGTH: 500,
} as const;

// ============================================================================
// TIMEOUTS & DEBOUNCING
// ============================================================================

export const TIMING = {
  SEARCH_DEBOUNCE_MS: 300,
  TOAST_DURATION_MS: 3000,
  LOADING_SIMULATION_MS: 800,
  ANIMATION_DURATION_MS: 200,
} as const;

// ============================================================================
// ROUTES
// ============================================================================

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  CATALOG: '/catalog',
  DASHBOARD: '/dashboard',
  ORDERS: '/orders',
  ORDER_DETAIL: (id: string) => `/orders/${id}`,
  CHECKOUT: '/checkout',
  DELIVERY_ZONES: '/delivery-zones',
  RETAILERS: '/retailers',
  BRANDS: '/brands',
  PAYOUTS: '/payouts',
} as const;

// ============================================================================
// LOCAL STORAGE KEYS
// ============================================================================

export const STORAGE_KEYS = {
  AUTH: 'vital-auth',
  CART: 'vital-cart',
  USER_PREFERENCES: 'vital-user-prefs',
  DASHBOARD_LAYOUT: 'vital-dashboard-layout',
  THEME: 'vital-theme',
  TOUR_COMPLETED: 'vital-tour-completed',
} as const;

// ============================================================================
// API ENDPOINTS (for future backend integration)
// ============================================================================

export const API_ENDPOINTS = {
  // Products
  PRODUCTS: '/api/products',
  PRODUCT_DETAIL: (id: string) => `/api/products/${id}`,
  PRODUCT_COA: (id: string) => `/api/products/${id}/coa`,

  // Cart
  CART: '/api/cart',
  CART_ITEMS: '/api/cart/items',
  CART_ITEM: (id: string) => `/api/cart/items/${id}`,

  // Orders
  ORDERS: '/api/orders',
  ORDER_DETAIL: (id: string) => `/api/orders/${id}`,
  ORDER_STATUS: (id: string) => `/api/orders/${id}/status`,

  // Delivery
  DELIVERY_CALCULATE: '/api/delivery/calculate',
  DELIVERY_ZONES: '/api/delivery/zones',

  // Dashboard
  DASHBOARD_KPIS: '/api/dashboard/kpis',
  DASHBOARD_RECENT_ORDERS: '/api/dashboard/recent-orders',
  DASHBOARD_PENDING_FULFILLMENT: '/api/dashboard/pending-fulfillment',

  // License
  LICENSES_PENDING: '/api/licenses/pending-approvals',
  LICENSE_APPROVE: (id: string) => `/api/licenses/${id}/approve`,
  LICENSE_DETAIL: (customerId: string) => `/api/licenses/${customerId}`,

  // Auth
  AUTH_LOGIN: '/api/auth/login',
  AUTH_LOGOUT: '/api/auth/logout',
  AUTH_REFRESH: '/api/auth/refresh',
  AUTH_ME: '/api/auth/me',
} as const;

// ============================================================================
// ERROR MESSAGES
// ============================================================================

export const ERROR_MESSAGES = {
  // General
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',

  // Products
  PRODUCT_NOT_FOUND: 'Product not found.',
  PRODUCT_OUT_OF_STOCK: 'This product is currently out of stock.',

  // Cart
  CART_EMPTY: 'Your cart is empty.',
  CART_STOCK_LIMIT: 'Not enough stock available.',

  // Orders
  ORDER_NOT_FOUND: 'Order not found.',
  ORDER_PLACEMENT_FAILED: 'Failed to place order. Please try again.',

  // Forms
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_PHONE: 'Phone number must be 10 digits.',
  INVALID_ZIP: 'ZIP code must be 5 digits.',
  REQUIRED_FIELD: 'This field is required.',

  // License
  LICENSE_SUSPENDED: 'Your license is suspended. Please contact support.',
  LICENSE_EXPIRED: 'Your license has expired. Please renew to continue.',

  // Auth
  INVALID_CREDENTIALS: 'Invalid email or password. Please try again.',
} as const;

// ============================================================================
// SUCCESS MESSAGES
// ============================================================================

export const SUCCESS_MESSAGES = {
  PRODUCT_ADDED: 'Product added to cart!',
  CART_UPDATED: 'Cart updated successfully.',
  ORDER_PLACED: 'Order placed successfully!',
  CHANGES_SAVED: 'Changes saved.',
} as const;
