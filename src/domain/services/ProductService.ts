import { Product } from '../entities/Product';

export class ProductService {
    static hasDiscount(product: Product): boolean {
        return product.originalPrice !== undefined && product.originalPrice > product.price;
    }

    static getDiscountPercentage(product: Product): number {
        if (!this.hasDiscount(product) || !product.originalPrice) return 0;
        return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    }

    static isAvailable(product: Product): boolean {
        return product.status === 'AVAILABLE';
    }
}