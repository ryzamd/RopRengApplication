/**
 * Category Repository Implementation
 * SQLite implementation of category data access
 */

import { database } from '../../core/database/Database';
import { Category } from '../../domain/entities/product/Category';
import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository';
import { BaseRepository } from './base/BaseRepository';

export class CategoryRepository
  extends BaseRepository<Category>
  implements ICategoryRepository
{
  constructor() {
    super('categories');
  }

  /**
   * Find all active categories
   */
  public async findActive(): Promise<Category[]> {
    const rows = await database.getAllAsync<any>(
      'SELECT * FROM categories WHERE is_active = 1 ORDER BY display_order ASC, name ASC'
    );

    return rows.map((row) => this.mapToEntity(row));
  }

  /**
   * Find category by name
   */
  public async findByName(name: string): Promise<Category | null> {
    const row = await database.getFirstAsync<any>(
      'SELECT * FROM categories WHERE name = ?',
      [name]
    );

    if (!row) {
      return null;
    }

    return this.mapToEntity(row);
  }

  /**
   * Search categories
   */
  public async search(query: string): Promise<Category[]> {
    const rows = await database.getAllAsync<any>(
      `SELECT * FROM categories
       WHERE (name LIKE ? OR description LIKE ?)
       AND is_active = 1
       ORDER BY name ASC
       LIMIT 20`,
      [`%${query}%`, `%${query}%`]
    );

    return rows.map((row) => this.mapToEntity(row));
  }

  /**
   * Get categories with product count
   */
  public async findWithProductCount(): Promise<(Category & { productCount: number })[]> {
    const rows = await database.getAllAsync<any>(
      `SELECT c.*, COUNT(p.id) as product_count
       FROM categories c
       LEFT JOIN products p ON c.id = p.category_id AND p.is_available = 1
       WHERE c.is_active = 1
       GROUP BY c.id
       ORDER BY c.display_order ASC, c.name ASC`
    );

    return rows.map((row) => {
      const category = this.mapToEntity(row) as Category & { productCount: number };
      category.productCount = row.product_count || 0;
      return category;
    });
  }

  /**
   * Update display order for categories
   */
  public async updateDisplayOrder(
    categoryId: string,
    displayOrder: number
  ): Promise<void> {
    await database.runAsync(
      'UPDATE categories SET display_order = ?, updated_at = ? WHERE id = ?',
      [displayOrder, Date.now(), categoryId]
    );
  }

  /**
   * Map database row to Category entity
   */
  protected mapToEntity(row: any): Category {
    return Category.fromDatabase({
      id: row.id,
      name: row.name,
      description: row.description || undefined,
      imageUrl: row.image_url || undefined,
      isActive: row.is_active === 1,
      orderIndex: row.display_order || 0,
      displayOrder: row.display_order || 0,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      syncedAt: row.synced_at,
    });
  }

  /**
   * Map Category entity to database row
   */
  protected mapFromEntity(category: Category): any {
    const props = category.toObject();

    return {
      id: props.id,
      name: props.name,
      description: props.description || null,
      image_url: props.imageUrl || null,
      is_active: props.isActive ? 1 : 0,
      display_order: props.displayOrder || 0,
      created_at: props.createdAt,
      updated_at: props.updatedAt,
      synced_at: props.syncedAt,
      is_synced: props.syncedAt ? 1 : 0,
    };
  }
}
