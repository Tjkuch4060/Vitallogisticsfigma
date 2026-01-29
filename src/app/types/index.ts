/**
 * Core Type Definitions for VitalLogistics B2B Portal
 * Centralized type system for better type safety and maintainability
 */

// ============================================================================
// ENUMS
// ============================================================================

export enum LicenseStatus {
  Active = 'Active',
  Suspended = 'Suspended',
  Expired = 'Expired',
  PendingApproval = 'PendingApproval'
}

export enum OrderStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Shipped = 'Shipped',
  Delivered = 'Delivered',
  Paid = 'Paid',
  Picking = 'Picking',
  Packed = 'Packed'
}

export enum DeliveryMethod {
  Delivery = 'delivery',
  Pickup = 'pickup'
}

export enum PaymentMethod {
  Card = 'card',
  Invoice = 'invoice',
  Net30 = 'net30'
}

// ============================================================================
// PRODUCT TYPES
// ============================================================================

export interface Product {
  id: string;
  sku: string;
  name: string;
  brand: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  rating: number;
  thc: number; // THC content in mg
  description?: string;
  batchNumber?: string;
  coaLink?: string; // Certificate of Analysis link
}

export type ProductCategory =
  | 'Tinctures'
  | 'Edibles'
  | 'Topicals'
  | 'Vapes'
  | 'Capsules'
  | 'Flower'
  | 'Beverages';

// ============================================================================
// CART TYPES (compatible with Zustand store)
// ============================================================================

export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: number; // timestamp
  lockedPrice: number; // Price at time of adding to cart
}

// ============================================================================
// ORDER TYPES
// ============================================================================

export interface Order {
  id: string;
  customer: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: number;
  zone?: number;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  priceAtPurchase: number;
}

export interface OrderDetail extends Order {
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress?: Address;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  trackingNumber?: string;
  estimatedDelivery?: string;
  notes?: string;
}

// ============================================================================
// ADDRESS TYPES
// ============================================================================

export interface Address {
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  addressLine2?: string;
  city: string;
  state: string;
  zip: string;
}

// ============================================================================
// DELIVERY TYPES
// ============================================================================

export interface DeliveryZone {
  id: string;
  name: string;
  zoneId: number;
  color: string;
  baseFee: number;
  freeThreshold: number; // Free shipping threshold
  days: string[]; // Delivery days e.g., ['Mon', 'Wed', 'Fri']
  description: string;
}

export interface DeliveryCalculation {
  name: string;
  fee: number;
  date: string;
  isFree: boolean;
  threshold: number;
}

// ============================================================================
// USER TYPES
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  company: string;
  role: UserRole;
  licenseStatus: LicenseStatus;
  licenseExpiration: Date;
  createdAt: Date;
  permissions: Permission[];
}

export enum UserRole {
  Admin = 'admin',
  Customer = 'customer',
  Viewer = 'viewer'
}

export enum Permission {
  ViewCatalog = 'view:catalog',
  PlaceOrders = 'place:orders',
  ViewOrders = 'view:orders',
  ViewDashboard = 'view:dashboard',
  ManageUsers = 'manage:users',
  ApproveLicenses = 'approve:licenses'
}

// ============================================================================
// FILTER TYPES
// ============================================================================

export interface FilterState {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  thcRange: [number, number];
  inStockOnly: boolean;
  searchQuery?: string;
}

export type SortOption =
  | 'name-asc'
  | 'name-desc'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'stock-asc';

// ============================================================================
// DASHBOARD TYPES
// ============================================================================

export interface KPIData {
  id: string;
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
  icon: string;
}

export interface ChartDataPoint {
  name: string;
  sales: number;
  date?: string;
}

export interface DashboardFilters {
  startDate: Date;
  endDate: Date;
  compareMode?: boolean;
}

// ============================================================================
// LICENSE TYPES
// ============================================================================

export interface LicenseApprovalRequest {
  id: string;
  retailerName: string;
  licenseNumber: string;
  state: string;
  submittedDate: string;
  documentUrl: string;
  status: 'pending' | 'approved' | 'rejected';
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface CheckoutFormData {
  // Contact Information
  name: string;
  company: string;
  email: string;
  phone: string;

  // Shipping Address
  address: string;
  addressLine2?: string;
  city: string;
  state: string;
  zip: string;

  // Delivery Options
  deliveryMethod: DeliveryMethod;
  deliveryInstructions?: string;

  // Payment
  paymentMethod: PaymentMethod;

  // Terms
  acceptedTerms: boolean;
}

export interface ProductFiltersFormData {
  categories: string[];
  brands: string[];
  priceMin: number;
  priceMax: number;
  thcMin: number;
  thcMax: number;
  inStockOnly: boolean;
}

// ============================================================================
// API TYPES (for future backend integration)
// ============================================================================

export interface APIResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface APIError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type ID = string;
export type Timestamp = number;

// Make all properties optional
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Make specific properties required
export type RequireBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

// ============================================================================
// COMPONENT PROP TYPES
// ============================================================================

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ProductCardProps extends BaseComponentProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  variant?: 'grid' | 'list';
}

export interface OrderRowProps {
  order: Order;
  onClick?: (order: Order) => void;
}

export interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down';
  icon?: React.ComponentType<{ className?: string }>;
  loading?: boolean;
}

// ============================================================================
// CONSTANTS TYPE EXPORTS
// ============================================================================

export const PRODUCT_CATEGORIES = [
  'Tinctures',
  'Edibles',
  'Topicals',
  'Vapes',
  'Capsules',
  'Flower',
  'Beverages'
] as const;

export const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
] as const;

export type USState = typeof US_STATES[number];
