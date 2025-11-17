/**
 * Domain Events
 * Type-safe event definitions for the application
 */

// Event types
export enum EventType {
  // User events
  USER_LOGGED_IN = 'USER_LOGGED_IN',
  USER_LOGGED_OUT = 'USER_LOGGED_OUT',
  USER_UPDATED = 'USER_UPDATED',

  // Product events
  PRODUCTS_LOADED = 'PRODUCTS_LOADED',
  PRODUCT_UPDATED = 'PRODUCT_UPDATED',

  // Order events
  ORDER_CREATED = 'ORDER_CREATED',
  ORDER_UPDATED = 'ORDER_UPDATED',
  ORDER_CANCELLED = 'ORDER_CANCELLED',
  ORDER_COMPLETED = 'ORDER_COMPLETED',

  // Payment events
  PAYMENT_INITIATED = 'PAYMENT_INITIATED',
  PAYMENT_SUCCESS = 'PAYMENT_SUCCESS',
  PAYMENT_FAILED = 'PAYMENT_FAILED',

  // Cart events
  CART_UPDATED = 'CART_UPDATED',
  CART_CLEARED = 'CART_CLEARED',

  // Sync events
  SYNC_STARTED = 'SYNC_STARTED',
  SYNC_COMPLETED = 'SYNC_COMPLETED',
  SYNC_FAILED = 'SYNC_FAILED',

  // Network events
  NETWORK_ONLINE = 'NETWORK_ONLINE',
  NETWORK_OFFLINE = 'NETWORK_OFFLINE',
  NETWORK_STATUS_CHANGED = 'NETWORK_STATUS_CHANGED',
}

// Event payload types
export interface UserLoggedInEvent {
  userId: string;
  timestamp: number;
}

export interface UserLoggedOutEvent {
  userId: string;
  timestamp: number;
}

export interface OrderCreatedEvent {
  orderId: string;
  userId: string;
  total: number;
  timestamp: number;
}

export interface OrderUpdatedEvent {
  orderId: string;
  status: string;
  timestamp: number;
}

export interface PaymentSuccessEvent {
  orderId: string;
  amount: number;
  method: string;
  timestamp: number;
}

export interface SyncCompletedEvent {
  itemsCount: number;
  duration: number;
  timestamp: number;
}

// Generic event interface
export interface DomainEvent<T = any> {
  type: EventType;
  payload: T;
  timestamp: number;
}
