/**
 * Get Products Use Case
 * Retrieves products with optional category filter
 */

import { Product } from '../../../domain/entities/product/Product';
import { ProductRepository } from '../../../infrastructure/repositories/ProductRepository';
import { ProductApi } from '../../../infrastructure/api/endpoints/ProductApi';
import { MockApiService } from '../../../infrastructure/mock/MockApiService';
import { ENV } from '../../../config/env';
import { Logger } from '../../../core/utils/Logger';
import { Price } from '../../../domain/entities/product/Price';

export interface GetProductsInput {
  categoryId?: string;
  search?: string;
  forceRefresh?: boolean;
}

export interface GetProductsOutput {
  products: Product[];
  total: number;
}

export class GetProductsUseCase {
  constructor(private productRepository: ProductRepository) {}

  public async execute(input: GetProductsInput = {}): Promise<GetProductsOutput> {
    try {
      Logger.info('Getting products', input);

      // Try to get from local database first (offline-first)
      if (!input.forceRefresh) {
        const localProducts = input.categoryId
          ? await this.productRepository.findByCategory(input.categoryId)
          : input.search
          ? await this.productRepository.search(input.search)
          : await this.productRepository.findAvailable();

        if (localProducts.length > 0) {
          Logger.info('Products retrieved from local database', {
            count: localProducts.length,
          });

          return {
            products: localProducts,
            total: localProducts.length,
          };
        }
      }

      // Fetch from API if local database is empty or force refresh
      const result = ENV.USE_MOCK_DATA
        ? await MockApiService.getProducts({
            categoryId: input.categoryId,
            search: input.search,
          })
        : await ProductApi.getProducts({
            categoryId: input.categoryId,
            search: input.search,
          });

      // Convert DTOs to domain entities
      const products = result.products.map((dto) =>
        Product.fromDatabase({
          id: dto.id,
          name: dto.name,
          description: dto.description,
          price: Price.create(dto.price),
          categoryId: dto.categoryId,
          imageUrl: dto.imageUrl,
          isAvailable: dto.isAvailable,
          createdAt: dto.createdAt,
          updatedAt: dto.updatedAt,
          syncedAt: Date.now(),
        })
      );

      // Save to local database for offline access
      await Promise.all(
        products.map((product) => this.productRepository.save(product))
      );

      Logger.info('Products retrieved from API and cached', {
        count: products.length,
      });

      return {
        products,
        total: result.total,
      };
    } catch (error: any) {
      Logger.error('Get products failed', error);

      // Fallback to local database on error
      const localProducts = input.categoryId
        ? await this.productRepository.findByCategory(input.categoryId)
        : await this.productRepository.findAvailable();

      if (localProducts.length > 0) {
        Logger.warn('Using cached products due to API error');
        return {
          products: localProducts,
          total: localProducts.length,
        };
      }

      throw new Error(
        error.message || 'Không thể tải sản phẩm. Vui lòng thử lại.'
      );
    }
  }
}
