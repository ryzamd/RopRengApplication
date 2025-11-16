/**
 * Product Data Transfer Objects
 * DTOs for product-related API requests/responses
 */

/**
 * Product response from API
 */
export interface ProductDTO {
  id: string;
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  imageUrl?: string;
  isAvailable: boolean;
  options?: ProductOptionDTO[];
  createdAt: number;
  updatedAt: number;
}

/**
 * Product option (e.g., size, toppings)
 */
export interface ProductOptionDTO {
  id: string;
  productId: string;
  name: string;
  type: 'single' | 'multiple';
  required: boolean;
  values: ProductOptionValueDTO[];
}

/**
 * Product option value (e.g., "Small", "Medium", "Large")
 */
export interface ProductOptionValueDTO {
  id: string;
  optionId: string;
  value: string;
  priceModifier: number;
}

/**
 * Category response from API
 */
export interface CategoryDTO {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: number;
  updatedAt: number;
}

/**
 * Get products request
 */
export interface GetProductsRequest {
  categoryId?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

/**
 * Get products response
 */
export interface GetProductsResponse {
  products: ProductDTO[];
  total: number;
}

/**
 * Get categories response
 */
export interface GetCategoriesResponse {
  categories: CategoryDTO[];
}
