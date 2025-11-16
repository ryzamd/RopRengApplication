/**
 * Service Registry
 * Centralized registration of all services
 *
 * This file wires up all dependencies
 */

import { container } from './ServiceContainer';
import { TYPES } from './types';
import { database } from '../database/Database';
import { DatabaseInitializer } from '../database/DatabaseInitializer';

/**
 * Register all services
 * Call this once at app startup
 */
export async function registerServices(): Promise<void> {
  console.log('[ServiceRegistry] Registering services...');

  // ===== DATABASE =====
  container.register(TYPES.Database, database);
  container.register(TYPES.DatabaseInitializer, DatabaseInitializer);

  // ===== UTILITIES =====
  // Will be registered after creating Logger, ErrorHandler, etc.

  // ===== SYNC =====
  // Will be registered after creating SyncEngine, etc.

  // ===== EVENT BUS =====
  // Will be registered after creating EventBus

  // ===== REPOSITORIES =====
  // Will be registered after creating repository implementations

  // ===== SERVICES =====
  // Will be registered after creating service implementations

  // ===== API CLIENTS =====
  // Will be registered after creating API client implementations

  console.log('[ServiceRegistry] Services registered successfully');
}

/**
 * Initialize all services
 * Call this after registerServices()
 */
export async function initializeServices(): Promise<void> {
  console.log('[ServiceRegistry] Initializing services...');

  // Initialize database
  const dbInitializer = container.resolve<typeof DatabaseInitializer>(
    TYPES.DatabaseInitializer
  );
  await dbInitializer.initialize();

  console.log('[ServiceRegistry] Services initialized successfully');
}
