/**
 * Welcome Screen - UI Service
 * Purpose: Business logic for welcome screen UI interactions
 */

import { Category, Product } from '../../../data/mockProducts';

export class WelcomeUIService {
  /**
   * Group products by category for organized display
   */
  static groupProductsByCategory(
    categories: Category[],
    products: Product[]
  ): { category: Category; products: Product[] }[] {
    return categories.map((category) => ({
        category,
        products: products.filter((p) => p.categoryId === category.id),
    }));
  }

  /**
   * Format price for display
   */
  static formatPrice(price: number): string {
    return `${price.toLocaleString('vi-VN')}đ`;
  }

  /**
   * Calculate promo banner pagination index
   */
  static calculateBannerIndex(scrollPosition: number, bannerWidth: number): number {
    return Math.round(scrollPosition / bannerWidth);
  }

  /**
   * Handle quick action selection
   */
  static handleQuickActionPress(actionId: string, label: string): void {
    console.log(`Quick action selected: ${label} (${actionId})`);
    // Future: Navigate to specific flow or open modal
  }

  /**
   * Handle brand selection
   */
  static handleBrandPress(brandId: string, brandName: string): void {
    console.log(`Brand selected: ${brandName} (${brandId})`);
    // Future: Switch brand context
  }

  /**
   * Handle promo banner press
   */
  static handlePromoPress(promoId: string): void {
    console.log(`Promo clicked: ${promoId}`);
    // Future: Open promo details
  }
}