export type ProductStatus = 'AVAILABLE' | 'OUT_OF_STOCK';
export type ProductBadge = 'NEW' | 'HOT';

export interface Product {
  readonly id: string;
  readonly menuItemId: number;
  readonly productId: number;
  readonly name: string;
  readonly price: number;
  readonly imageUrl: string;
  readonly categoryId: string;
  readonly originalPrice?: number;
  readonly badge?: ProductBadge;
  readonly discount?: string;
  readonly status: ProductStatus;
}