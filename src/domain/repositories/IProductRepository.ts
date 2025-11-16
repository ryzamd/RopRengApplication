/**
 * Product Repository Interface
 * Contract for product data access
 */

import { IRepository } from './IRepository';

// Placeholder interface - will be implemented with Product entity
export interface IProductRepository extends IRepository<any> {
  /**
   * Find products by category
   */
  findByCategory(categoryId: string): Promise<any[]>;

  /**
   * Search products
   */
  search(query: string): Promise<any[]>;

  /**
   * Find available products
   */
  findAvailable(): Promise<any[]>;
}
