/**
 * Voucher Service
 * Business logic for voucher/discount operations
 */

import { Logger } from '../../core/utils/Logger';

export interface Voucher {
  code: string;
  type: 'percentage' | 'fixed';
  value: number; // Percentage (0-100) or fixed amount
  minOrderValue?: number;
  maxDiscount?: number;
  expiresAt: number;
  usageLimit?: number;
  usageCount?: number;
}

export interface ApplyVoucherResult {
  isValid: boolean;
  discount: number;
  error?: string;
  voucher?: Voucher;
}

export class VoucherService {
  /**
   * Apply voucher to order total
   */
  public static applyVoucher(
    voucherCode: string,
    orderTotal: number,
    availableVouchers: Voucher[]
  ): ApplyVoucherResult {
    // Find voucher
    const voucher = availableVouchers.find(
      (v) => v.code.toUpperCase() === voucherCode.toUpperCase()
    );

    if (!voucher) {
      return {
        isValid: false,
        discount: 0,
        error: 'Mã giảm giá không tồn tại',
      };
    }

    // Check if expired
    if (Date.now() > voucher.expiresAt) {
      return {
        isValid: false,
        discount: 0,
        error: 'Mã giảm giá đã hết hạn',
      };
    }

    // Check usage limit
    if (
      voucher.usageLimit &&
      voucher.usageCount &&
      voucher.usageCount >= voucher.usageLimit
    ) {
      return {
        isValid: false,
        discount: 0,
        error: 'Mã giảm giá đã hết lượt sử dụng',
      };
    }

    // Check minimum order value
    if (voucher.minOrderValue && orderTotal < voucher.minOrderValue) {
      return {
        isValid: false,
        discount: 0,
        error: `Đơn hàng tối thiểu ${this.formatPrice(voucher.minOrderValue)}`,
      };
    }

    // Calculate discount
    let discount = 0;

    if (voucher.type === 'percentage') {
      discount = Math.floor((orderTotal * voucher.value) / 100);

      // Apply max discount limit
      if (voucher.maxDiscount && discount > voucher.maxDiscount) {
        discount = voucher.maxDiscount;
      }
    } else {
      discount = voucher.value;

      // Discount cannot exceed order total
      if (discount > orderTotal) {
        discount = orderTotal;
      }
    }

    Logger.info('Voucher applied', {
      code: voucherCode,
      discount,
      orderTotal,
    });

    return {
      isValid: true,
      discount,
      voucher,
    };
  }

  /**
   * Validate voucher code format
   */
  public static validateVoucherCode(code: string): {
    isValid: boolean;
    error?: string;
  } {
    if (!code || code.trim().length === 0) {
      return {
        isValid: false,
        error: 'Vui lòng nhập mã giảm giá',
      };
    }

    if (code.length < 4) {
      return {
        isValid: false,
        error: 'Mã giảm giá không hợp lệ',
      };
    }

    return { isValid: true };
  }

  /**
   * Format price for display
   */
  private static formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  }

  /**
   * Format voucher discount
   */
  public static formatVoucherDiscount(voucher: Voucher): string {
    if (voucher.type === 'percentage') {
      let text = `Giảm ${voucher.value}%`;

      if (voucher.maxDiscount) {
        text += ` (tối đa ${this.formatPrice(voucher.maxDiscount)})`;
      }

      return text;
    } else {
      return `Giảm ${this.formatPrice(voucher.value)}`;
    }
  }

  /**
   * Check if voucher is still valid
   */
  public static isVoucherValid(voucher: Voucher): boolean {
    // Check expiration
    if (Date.now() > voucher.expiresAt) {
      return false;
    }

    // Check usage limit
    if (
      voucher.usageLimit &&
      voucher.usageCount &&
      voucher.usageCount >= voucher.usageLimit
    ) {
      return false;
    }

    return true;
  }
}
