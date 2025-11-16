/**
 * Database Initializer
 * Handles database schema creation and migrations
 *
 * Responsibilities:
 * - Create tables on first launch
 * - Run migrations for schema updates
 * - Seed initial data
 */

import { database } from './Database';
import { SCHEMA } from './schema';
import { migrations } from './migrations';
import { DATABASE_CONFIG } from '../../config/database.config';

export class DatabaseInitializer {
  /**
   * Initialize database schema
   */
  public static async initialize(): Promise<void> {
    try {
      console.log('[DatabaseInitializer] Starting initialization...');

      // Initialize database connection
      await database.initialize();

      // Get current version
      const currentVersion = await this.getCurrentVersion();
      console.log(`[DatabaseInitializer] Current version: ${currentVersion}`);

      // Create tables if first launch
      if (currentVersion === 0) {
        await this.createTables();
        await this.setVersion(DATABASE_CONFIG.version);
        console.log('[DatabaseInitializer] Tables created successfully');
      }

      // Run migrations if needed
      if (currentVersion < DATABASE_CONFIG.version) {
        await this.runMigrations(currentVersion, DATABASE_CONFIG.version);
        await this.setVersion(DATABASE_CONFIG.version);
        console.log(
          `[DatabaseInitializer] Migrated from v${currentVersion} to v${DATABASE_CONFIG.version}`
        );
      }

      console.log('[DatabaseInitializer] Initialization complete');
    } catch (error) {
      console.error('[DatabaseInitializer] Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Create all tables
   */
  private static async createTables(): Promise<void> {
    console.log('[DatabaseInitializer] Creating tables...');

    // Execute all table creation statements
    for (const [tableName, sql] of Object.entries(SCHEMA)) {
      try {
        await database.execAsync(sql);
        console.log(`[DatabaseInitializer] Created table: ${tableName}`);
      } catch (error) {
        console.error(`[DatabaseInitializer] Failed to create table ${tableName}:`, error);
        throw error;
      }
    }
  }

  /**
   * Run migrations
   */
  private static async runMigrations(
    fromVersion: number,
    toVersion: number
  ): Promise<void> {
    console.log(`[DatabaseInitializer] Running migrations from v${fromVersion} to v${toVersion}...`);

    // Get migrations to run
    const migrationsToRun = migrations.filter(
      (m) => m.version > fromVersion && m.version <= toVersion
    );

    // Sort by version
    migrationsToRun.sort((a, b) => a.version - b.version);

    // Run each migration
    for (const migration of migrationsToRun) {
      try {
        console.log(`[DatabaseInitializer] Running migration: ${migration.name}`);
        await migration.up(database);
        console.log(`[DatabaseInitializer] Migration ${migration.name} completed`);
      } catch (error) {
        console.error(
          `[DatabaseInitializer] Migration ${migration.name} failed:`,
          error
        );
        throw error;
      }
    }
  }

  /**
   * Get current database version
   */
  private static async getCurrentVersion(): Promise<number> {
    try {
      const result = await database.getFirstAsync<{ user_version: number }>(
        'PRAGMA user_version'
      );
      return result?.user_version ?? 0;
    } catch (error) {
      console.error('[DatabaseInitializer] Failed to get version:', error);
      return 0;
    }
  }

  /**
   * Set database version
   */
  private static async setVersion(version: number): Promise<void> {
    await database.execAsync(`PRAGMA user_version = ${version}`);
  }

  /**
   * Reset database (for development/testing)
   */
  public static async reset(): Promise<void> {
    console.log('[DatabaseInitializer] Resetting database...');

    await database.dropAllTables();
    await this.setVersion(0);
    await this.initialize();

    console.log('[DatabaseInitializer] Database reset complete');
  }
}
