export type ProductStatus = 'AVAILABLE' | 'OUT_OF_STOCK';
export type ProductBadge = 'NEW' | 'HOT';

export class Product {
  constructor(
    public readonly id: string,
    public readonly menuItemId: number,
    public readonly productId: number,
    public readonly name: string,
    public readonly price: number,
    public readonly imageUrl: string,
    public readonly categoryId: string,
    public readonly originalPrice?: number,
    public readonly badge?: ProductBadge,
    public readonly discount?: string,
    public readonly status: ProductStatus = 'AVAILABLE'
  ) {}

  get hasDiscount(): boolean {
    return this.originalPrice !== undefined && this.originalPrice > this.price;
  }

  get discountPercentage(): number {
    if (!this.hasDiscount || !this.originalPrice) return 0;
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }

  get formattedPrice(): string {
    return `${this.price.toLocaleString('vi-VN')}đ`;
  }

  get isAvailable(): boolean {
    return this.status === 'AVAILABLE';
  }
}