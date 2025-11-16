/**
 * Database Singleton
 * Manages SQLite database connection and operations
 *
 * Responsibilities:
 * - Initialize database connection
 * - Execute queries
 * - Handle transactions
 * - Connection pooling
 */

import * as SQLite from 'expo-sqlite';
import { DATABASE_CONFIG } from '../../config/database.config';

export class Database {
  private static instance: Database;
  private db: SQLite.SQLiteDatabase | null = null;
  private isInitialized = false;

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  /**
   * Initialize database
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // Open database
      this.db = await SQLite.openDatabaseAsync(DATABASE_CONFIG.name);

      // Enable foreign keys
      if (DATABASE_CONFIG.foreignKeys) {
        await this.db.execAsync('PRAGMA foreign_keys = ON;');
      }

      // Enable WAL mode for better concurrency
      if (DATABASE_CONFIG.enableWAL) {
        await this.db.execAsync('PRAGMA journal_mode = WAL;');
      }

      this.isInitialized = true;
      console.log('[Database] Initialized successfully');
    } catch (error) {
      console.error('[Database] Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Execute a single SQL statement
   */
  public async execAsync(sql: string): Promise<void> {
    this.ensureInitialized();
    if (!this.db) throw new Error('Database not initialized');

    await this.db.execAsync(sql);
  }

  /**
   * Get single row
   */
  public async getFirstAsync<T>(
    sql: string,
    params?: any[]
  ): Promise<T | null> {
    this.ensureInitialized();
    if (!this.db) throw new Error('Database not initialized');

    return await this.db.getFirstAsync<T>(sql, params);
  }

  /**
   * Get all rows
   */
  public async getAllAsync<T>(
    sql: string,
    params?: any[]
  ): Promise<T[]> {
    this.ensureInitialized();
    if (!this.db) throw new Error('Database not initialized');

    return await this.db.getAllAsync<T>(sql, params);
  }

  /**
   * Run a statement (INSERT, UPDATE, DELETE)
   */
  public async runAsync(
    sql: string,
    params?: any[]
  ): Promise<SQLite.SQLiteRunResult> {
    this.ensureInitialized();
    if (!this.db) throw new Error('Database not initialized');

    return await this.db.runAsync(sql, params);
  }

  /**
   * Execute transaction
   */
  public async withTransactionAsync<T>(
    task: (txn: SQLite.SQLiteDatabase) => Promise<T>
  ): Promise<T> {
    this.ensureInitialized();
    if (!this.db) throw new Error('Database not initialized');

    return await this.db.withTransactionAsync(task);
  }

  /**
   * Execute exclusive transaction
   */
  public async withExclusiveTransactionAsync<T>(
    task: (txn: SQLite.SQLiteDatabase) => Promise<T>
  ): Promise<T> {
    this.ensureInitialized();
    if (!this.db) throw new Error('Database not initialized');

    return await this.db.withExclusiveTransactionAsync(task);
  }

  /**
   * Close database connection
   */
  public async close(): Promise<void> {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
      this.isInitialized = false;
      console.log('[Database] Closed');
    }
  }

  /**
   * Drop all tables (for testing)
   */
  public async dropAllTables(): Promise<void> {
    this.ensureInitialized();
    if (!this.db) throw new Error('Database not initialized');

    const tables = await this.db.getAllAsync<{ name: string }>(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
    );

    for (const table of tables) {
      await this.db.execAsync(`DROP TABLE IF EXISTS ${table.name}`);
    }

    console.log('[Database] All tables dropped');
  }

  /**
   * Get database instance (for direct access if needed)
   */
  public getDatabase(): SQLite.SQLiteDatabase {
    this.ensureInitialized();
    if (!this.db) throw new Error('Database not initialized');
    return this.db;
  }

  /**
   * Ensure database is initialized
   */
  private ensureInitialized(): void {
    if (!this.isInitialized || !this.db) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
  }
}

// Export singleton instance
export const database = Database.getInstance();
