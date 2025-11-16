/**
 * Base Repository
 * Generic repository implementation for SQLite
 *
 * Provides common CRUD operations for all repositories
 */

import { database } from '../../../core/database/Database';
import { IRepository } from '../../../domain/repositories/IRepository';

export abstract class BaseRepository<T> implements IRepository<T> {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  /**
   * Find by ID
   */
  public async findById(id: string): Promise<T | null> {
    const row = await database.getFirstAsync<any>(
      `SELECT * FROM ${this.tableName} WHERE id = ?`,
      [id]
    );

    if (!row) {
      return null;
    }

    return this.mapToEntity(row);
  }

  /**
   * Find all
   */
  public async findAll(options?: {
    limit?: number;
    offset?: number;
  }): Promise<T[]> {
    const limit = options?.limit ?? 100;
    const offset = options?.offset ?? 0;

    const rows = await database.getAllAsync<any>(
      `SELECT * FROM ${this.tableName}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    return rows.map((row) => this.mapToEntity(row));
  }

  /**
   * Save (insert or update)
   */
  public async save(entity: T): Promise<void> {
    const data = this.mapFromEntity(entity);
    const exists = await this.exists(data.id);

    if (exists) {
      await this.update(data);
    } else {
      await this.insert(data);
    }
  }

  /**
   * Delete
   */
  public async delete(id: string): Promise<void> {
    await database.runAsync(
      `DELETE FROM ${this.tableName} WHERE id = ?`,
      [id]
    );
  }

  /**
   * Check if exists
   */
  public async exists(id: string): Promise<boolean> {
    const result = await database.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM ${this.tableName} WHERE id = ?`,
      [id]
    );

    return (result?.count ?? 0) > 0;
  }

  /**
   * Count
   */
  public async count(): Promise<number> {
    const result = await database.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM ${this.tableName}`
    );

    return result?.count ?? 0;
  }

  /**
   * Insert record
   */
  protected async insert(data: any): Promise<void> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');

    await database.runAsync(
      `INSERT INTO ${this.tableName} (${keys.join(', ')})
       VALUES (${placeholders})`,
      values
    );
  }

  /**
   * Update record
   */
  protected async update(data: any): Promise<void> {
    const { id, ...updates } = data;
    const keys = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = keys.map((key) => `${key} = ?`).join(', ');

    await database.runAsync(
      `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`,
      [...values, id]
    );
  }

  /**
   * Map database row to entity (must be implemented by subclass)
   */
  protected abstract mapToEntity(row: any): T;

  /**
   * Map entity to database row (must be implemented by subclass)
   */
  protected abstract mapFromEntity(entity: T): any;
}
