/**
 * Cart Service
 * Business logic for shopping cart operations
 */

import { Product } from '../../domain/entities/product/Product';
import { Price } from '../../domain/entities/product/Price';
import { ProductOptionDTO } from '../../infrastructure/api/dto';

export interface CalculateItemPriceInput {
  basePrice: Price;
  selectedOptions?: Record<string, string>;
  productOptions?: ProductOptionDTO[];
}

export interface CalculateItemPriceOutput {
  totalPrice: Price;
  priceModifier: number;
}

export class CartService {
  /**
   * Calculate item price with selected options
   */
  public static calculateItemPrice(
    input: CalculateItemPriceInput
  ): CalculateItemPriceOutput {
    const { basePrice, selectedOptions, productOptions } = input;

    if (!selectedOptions || !productOptions || productOptions.length === 0) {
      return {
        totalPrice: basePrice,
        priceModifier: 0,
      };
    }

    let priceModifier = 0;

    // Calculate price modifier from selected options
    for (const [optionName, selectedValue] of Object.entries(selectedOptions)) {
      // Find the option
      const option = productOptions.find((opt) => opt.name === optionName);
      if (!option) continue;

      // For multiple selection options, split by comma
      const selectedValues = selectedValue.split(', ');

      for (const value of selectedValues) {
        const optionValue = option.values.find((v) => v.value === value.trim());
        if (optionValue) {
          priceModifier += optionValue.priceModifier;
        }
      }
    }

    const totalPrice = basePrice.add(Price.create(priceModifier));

    return {
      totalPrice,
      priceModifier,
    };
  }

  /**
   * Calculate delivery fee based on distance
   */
  public static calculateDeliveryFee(distanceKm: number): number {
    const BASE_FEE = 15000; // 15k VND
    const PER_KM_FEE = 5000; // 5k VND per km

    if (distanceKm <= 3) {
      return BASE_FEE;
    }

    return BASE_FEE + (distanceKm - 3) * PER_KM_FEE;
  }

  /**
   * Validate cart before checkout
   */
  public static validateCart(items: any[]): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (items.length === 0) {
      errors.push('Giỏ hàng trống');
      return { isValid: false, errors };
    }

    // Check each item
    for (const item of items) {
      if (item.quantity <= 0) {
        errors.push(`Số lượng của ${item.product.toObject().name} phải lớn hơn 0`);
      }

      if (item.quantity > 99) {
        errors.push(`Số lượng của ${item.product.toObject().name} không được vượt quá 99`);
      }

      if (!item.product.toObject().isAvailable) {
        errors.push(`Sản phẩm ${item.product.toObject().name} hiện không có sẵn`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Format price for display
   */
  public static formatPrice(price: number | Price): string {
    const value = typeof price === 'number' ? price : price.toValue();
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  }

  /**
   * Calculate estimated delivery time
   */
  public static calculateEstimatedDeliveryTime(distanceKm: number): number {
    const PREP_TIME = 15; // 15 minutes preparation
    const SPEED_KM_PER_MIN = 0.5; // 30 km/h average speed

    const travelTime = Math.ceil(distanceKm / SPEED_KM_PER_MIN);
    const totalMinutes = PREP_TIME + travelTime;

    return Date.now() + totalMinutes * 60 * 1000;
  }
}
