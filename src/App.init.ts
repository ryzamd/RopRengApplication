/**
 * App Initialization
 * Sets up dependency injection, database, and services
 */

import { ServiceContainer } from './core/di/ServiceContainer';
import { TYPES } from './core/di/types';
import { Database } from './core/database/Database';
import { DatabaseInitializer } from './core/database/DatabaseInitializer';
import { UserRepository } from './infrastructure/repositories/UserRepository';
import { ProductRepository } from './infrastructure/repositories/ProductRepository';
import { CategoryRepository } from './infrastructure/repositories/CategoryRepository';
import { OrderRepository } from './infrastructure/repositories/OrderRepository';
import { PaymentRepository } from './infrastructure/repositories/PaymentRepository';
import { StoreRepository } from './infrastructure/repositories/StoreRepository';
import { SyncService } from './application/services/SyncService';
import { Logger } from './core/utils/Logger';

/**
 * Initialize application
 */
export async function initializeApp(): Promise<void> {
  try {
    Logger.info('Initializing application...');

    // Initialize database
    await initializeDatabase();

    // Setup dependency injection
    setupDependencyInjection();

    // Initialize sync service
    await initializeSyncService();

    Logger.info('Application initialized successfully');
  } catch (error: any) {
    Logger.error('Application initialization failed', error);
    throw error;
  }
}

/**
 * Initialize database
 */
async function initializeDatabase(): Promise<void> {
  Logger.info('Initializing database...');

  const database = Database.getInstance();
  await database.initialize();

  await DatabaseInitializer.initialize();

  Logger.info('Database initialized');
}

/**
 * Setup dependency injection container
 */
function setupDependencyInjection(): void {
  Logger.info('Setting up dependency injection...');

  const container = ServiceContainer.getInstance();

  // Register repositories
  container.register(TYPES.UserRepository, new UserRepository());
  container.register(TYPES.ProductRepository, new ProductRepository());
  container.register(TYPES.CategoryRepository, new CategoryRepository());
  container.register(TYPES.OrderRepository, new OrderRepository());
  container.register(TYPES.PaymentRepository, new PaymentRepository());
  container.register(TYPES.StoreRepository, new StoreRepository());

  Logger.info('Dependency injection configured');
}

/**
 * Initialize sync service
 */
async function initializeSyncService(): Promise<void> {
  Logger.info('Initializing sync service...');

  const syncService = SyncService.getInstance();
  await syncService.initialize();

  Logger.info('Sync service initialized');
}

/**
 * Cleanup on app shutdown
 */
export async function cleanupApp(): Promise<void> {
  try {
    Logger.info('Cleaning up application...');

    // Stop sync service
    const syncService = SyncService.getInstance();
    await syncService.stop();

    Logger.info('Application cleanup complete');
  } catch (error: any) {
    Logger.error('Application cleanup failed', error);
  }
}
