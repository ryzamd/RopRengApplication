/**
 * Product Repository Implementation
 * SQLite implementation of product data access
 */

import { database } from '../../core/database/Database';
import { Product } from '../../domain/entities/product/Product';
import { Price } from '../../domain/entities/product/Price';
import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { BaseRepository } from './base/BaseRepository';

export class ProductRepository
  extends BaseRepository<Product>
  implements IProductRepository
{
  constructor() {
    super('products');
  }

  /**
   * Find products by category
   */
  public async findByCategory(categoryId: string): Promise<Product[]> {
    const rows = await database.getAllAsync<any>(
      'SELECT * FROM products WHERE category_id = ? AND is_available = 1',
      [categoryId]
    );

    return rows.map((row) => this.mapToEntity(row));
  }

  /**
   * Search products
   */
  public async search(query: string): Promise<Product[]> {
    const rows = await database.getAllAsync<any>(
      `SELECT * FROM products
       WHERE (name LIKE ? OR description LIKE ?)
       AND is_available = 1
       LIMIT 50`,
      [`%${query}%`, `%${query}%`]
    );

    return rows.map((row) => this.mapToEntity(row));
  }

  /**
   * Find available products
   */
  public async findAvailable(): Promise<Product[]> {
    const rows = await database.getAllAsync<any>(
      'SELECT * FROM products WHERE is_available = 1 ORDER BY name ASC'
    );

    return rows.map((row) => this.mapToEntity(row));
  }

  /**
   * Map database row to Product entity
   */
  protected mapToEntity(row: any): Product {
    return Product.fromDatabase({
      id: row.id,
      name: row.name,
      description: row.description,
      price: Price.create(row.price),
      categoryId: row.category_id,
      imageUrl: row.image_url,
      isAvailable: row.is_available === 1,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      syncedAt: row.synced_at,
    });
  }

  /**
   * Map Product entity to database row
   */
  protected mapFromEntity(product: Product): any {
    const props = product.toObject();

    return {
      id: props.id,
      name: props.name,
      description: props.description,
      price: props.price.toValue(),
      category_id: props.categoryId,
      image_url: props.imageUrl,
      is_available: props.isAvailable ? 1 : 0,
      created_at: props.createdAt,
      updated_at: props.updatedAt,
      synced_at: props.syncedAt,
      is_synced: props.syncedAt ? 1 : 0,
    };
  }
}
