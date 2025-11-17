/**
 * Get Categories Use Case
 * Retrieves all product categories
 */

import { Category } from '../../../domain/entities/product/Category';
import { ICategoryRepository } from '../../../domain/repositories/ICategoryRepository';
import { ProductApi } from '../../../infrastructure/api/endpoints/ProductApi';
import { MockApiService } from '../../../infrastructure/mock/MockApiService';
import { ENV } from '../../../config/env';
import { Logger } from '../../../core/utils/Logger';

export interface GetCategoriesOutput {
  categories: Category[];
}

export class GetCategoriesUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  public async execute(forceRefresh: boolean = false): Promise<GetCategoriesOutput> {
    try {
      Logger.info('Getting categories', { forceRefresh });

      // Try to get from local database first (offline-first)
      if (!forceRefresh) {
        const localCategories = await this.categoryRepository.findActive();

        if (localCategories.length > 0) {
          Logger.info('Categories retrieved from local database', {
            count: localCategories.length,
          });

          return { categories: localCategories };
        }
      }

      // Fetch from API if local database is empty or force refresh
      const result = ENV.USE_MOCK_DATA
        ? await MockApiService.getCategories()
        : await ProductApi.getCategories();

      // Convert DTOs to domain entities
      const categories = result.categories.map((dto) =>
        Category.fromDatabase({
          id: dto.id,
          name: dto.name,
          description: dto.description,
          imageUrl: dto.imageUrl,
          isActive: dto.isActive,
          orderIndex: dto.displayOrder,
          displayOrder: dto.displayOrder,
          createdAt: dto.createdAt,
          updatedAt: dto.updatedAt,
          syncedAt: Date.now(),
        })
      );

      // Save to local database for offline access
      await Promise.all(
        categories.map((category) => this.categoryRepository.save(category))
      );

      Logger.info('Categories retrieved from API and cached', {
        count: categories.length,
      });

      return { categories };
    } catch (error: any) {
      Logger.error('Get categories failed', error);

      // Fallback to local database on error
      const localCategories = await this.categoryRepository.findActive();

      if (localCategories.length > 0) {
        Logger.warn('Using cached categories due to API error');
        return { categories: localCategories };
      }

      throw new Error(
        error.message || 'Không thể tải danh mục. Vui lòng thử lại.'
      );
    }
  }
}
