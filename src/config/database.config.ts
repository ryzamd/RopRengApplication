/**
 * Database Configuration
 * SQLite database settings for offline-first architecture
 */

export const DATABASE_CONFIG = {
  // Database name
  name: 'ropreng.db',

  // Current schema version
  version: 1,

  // Enable WAL mode for better concurrency
  enableWAL: true,

  // Connection pool size
  poolSize: 5,

  // Query timeout (ms)
  timeout: 5000,

  // Enable foreign keys
  foreignKeys: true,

  // Sync settings
  sync: {
    enabled: true,
    intervalMs: 5 * 60 * 1000, // 5 minutes
    retryAttempts: 3,
    retryDelayMs: 2000,
  },

  // Cache settings
  cache: {
    enabled: true,
    maxSize: 100, // Max cached queries
    ttlMs: 5 * 60 * 1000, // 5 minutes
  },
} as const;

export type DatabaseConfig = typeof DATABASE_CONFIG;
