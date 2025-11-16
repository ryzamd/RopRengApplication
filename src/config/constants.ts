/**
 * Application Constants
 * Global constants used throughout the application
 */

// Sync priorities
export enum SyncPriority {
  CRITICAL = 1,  // Payment, Order creation
  HIGH = 2,      // User profile updates
  MEDIUM = 3,    // Cart updates
  LOW = 4,       // Analytics, logs
}

// Sync operation types
export enum SyncOperation {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

// Entity types for sync
export enum EntityType {
  USER = 'USER',
  PRODUCT = 'PRODUCT',
  ORDER = 'ORDER',
  PAYMENT = 'PAYMENT',
  LOYALTY = 'LOYALTY',
  STORE = 'STORE',
}

// Order status
export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  DELIVERING = 'DELIVERING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

// Payment status
export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

// Payment methods
export enum PaymentMethod {
  CASH = 'CASH',
  VNPAY = 'VNPAY',
  MOMO = 'MOMO',
  LOYALTY_POINTS = 'LOYALTY_POINTS',
}

// Loyalty transaction types
export enum LoyaltyTransactionType {
  EARN = 'EARN',
  REDEEM = 'REDEEM',
  EXPIRE = 'EXPIRE',
  REFUND = 'REFUND',
}

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

// Cache keys
export const CACHE_KEYS = {
  PRODUCTS: 'products',
  PRODUCT_DETAIL: 'product_detail',
  CATEGORIES: 'categories',
  STORES: 'stores',
  USER_PROFILE: 'user_profile',
  ORDERS: 'orders',
  LOYALTY: 'loyalty',
} as const;

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_ID: 'user_id',
  SELECTED_STORE: 'selected_store',
  CART: 'cart',
} as const;
