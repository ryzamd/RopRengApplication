/**
 * Dependency Injection Types
 * Type definitions for DI container
 */

// Service identifiers
export const TYPES = {
  // Database
  Database: Symbol.for('Database'),
  DatabaseInitializer: Symbol.for('DatabaseInitializer'),

  // Repositories
  UserRepository: Symbol.for('UserRepository'),
  ProductRepository: Symbol.for('ProductRepository'),
  OrderRepository: Symbol.for('OrderRepository'),
  PaymentRepository: Symbol.for('PaymentRepository'),
  LoyaltyRepository: Symbol.for('LoyaltyRepository'),
  StoreRepository: Symbol.for('StoreRepository'),

  // Services
  AuthService: Symbol.for('AuthService'),
  OTPService: Symbol.for('OTPService'),
  PricingService: Symbol.for('PricingService'),
  DiscountService: Symbol.for('DiscountService'),
  LoyaltyService: Symbol.for('LoyaltyService'),
  CartService: Symbol.for('CartService'),
  SessionService: Symbol.for('SessionService'),

  // API Clients
  ApiClient: Symbol.for('ApiClient'),
  UserApi: Symbol.for('UserApi'),
  ProductApi: Symbol.for('ProductApi'),
  OrderApi: Symbol.for('OrderApi'),
  PaymentApi: Symbol.for('PaymentApi'),
  LoyaltyApi: Symbol.for('LoyaltyApi'),

  // Sync
  SyncEngine: Symbol.for('SyncEngine'),
  SyncQueue: Symbol.for('SyncQueue'),
  ConflictResolver: Symbol.for('ConflictResolver'),
  NetworkMonitor: Symbol.for('NetworkMonitor'),

  // Events
  EventBus: Symbol.for('EventBus'),

  // Utils
  Logger: Symbol.for('Logger'),
  ErrorHandler: Symbol.for('ErrorHandler'),
  Performance: Symbol.for('Performance'),
} as const;

export type ServiceType = typeof TYPES[keyof typeof TYPES];
