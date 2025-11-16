/**
 * Generic Repository Interface
 * Base interface for all repositories
 */

export interface IRepository<T> {
  /**
   * Find by ID
   */
  findById(id: string): Promise<T | null>;

  /**
   * Find all
   */
  findAll(options?: {
    limit?: number;
    offset?: number;
  }): Promise<T[]>;

  /**
   * Save (create or update)
   */
  save(entity: T): Promise<void>;

  /**
   * Delete
   */
  delete(id: string): Promise<void>;

  /**
   * Check if exists
   */
  exists(id: string): Promise<boolean>;

  /**
   * Count
   */
  count(): Promise<number>;
}
