/**
 * Product API
 * API endpoints for product-related operations
 */

import { apiClient } from '../ApiClient';
import {
  ProductDTO,
  CategoryDTO,
  GetProductsRequest,
  GetProductsResponse,
  GetCategoriesResponse,
} from '../dto';

export class ProductApi {
  private static readonly BASE_PATH = '/products';
  private static readonly CATEGORIES_PATH = '/categories';

  /**
   * Get all products with optional filters
   */
  public static async getProducts(
    request?: GetProductsRequest
  ): Promise<GetProductsResponse> {
    const response = await apiClient.get<GetProductsResponse>(
      this.BASE_PATH,
      {
        params: request,
      }
    );
    return response.data;
  }

  /**
   * Get product by ID
   */
  public static async getProductById(productId: string): Promise<ProductDTO> {
    const response = await apiClient.get<ProductDTO>(
      `${this.BASE_PATH}/${productId}`
    );
    return response.data;
  }

  /**
   * Get products by category
   */
  public static async getProductsByCategory(
    categoryId: string
  ): Promise<GetProductsResponse> {
    const response = await apiClient.get<GetProductsResponse>(
      this.BASE_PATH,
      {
        params: { categoryId },
      }
    );
    return response.data;
  }

  /**
   * Search products
   */
  public static async searchProducts(
    query: string
  ): Promise<GetProductsResponse> {
    const response = await apiClient.get<GetProductsResponse>(
      `${this.BASE_PATH}/search`,
      {
        params: { q: query },
      }
    );
    return response.data;
  }

  /**
   * Get all categories
   */
  public static async getCategories(): Promise<GetCategoriesResponse> {
    const response = await apiClient.get<GetCategoriesResponse>(
      this.CATEGORIES_PATH
    );
    return response.data;
  }

  /**
   * Get category by ID
   */
  public static async getCategoryById(
    categoryId: string
  ): Promise<CategoryDTO> {
    const response = await apiClient.get<CategoryDTO>(
      `${this.CATEGORIES_PATH}/${categoryId}`
    );
    return response.data;
  }

  /**
   * Get available products
   */
  public static async getAvailableProducts(): Promise<GetProductsResponse> {
    const response = await apiClient.get<GetProductsResponse>(
      `${this.BASE_PATH}/available`
    );
    return response.data;
  }
}
