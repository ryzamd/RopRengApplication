/**
 * Category Repository Interface
 * Contract for category data access
 */

import { IRepository } from './IRepository';
import { Category } from '../entities/product/Category';

export interface ICategoryRepository extends IRepository<Category> {
  /**
   * Find active categories
   */
  findActive(): Promise<Category[]>;

  /**
   * Find category by name
   */
  findByName(name: string): Promise<Category | null>;

  /**
   * Search categories
   */
  search(query: string): Promise<Category[]>;

  /**
   * Find categories with product count
   */
  findWithProductCount(): Promise<(Category & { productCount: number })[]>;

  /**
   * Update display order
   */
  updateDisplayOrder(categoryId: string, displayOrder: number): Promise<void>;
}
