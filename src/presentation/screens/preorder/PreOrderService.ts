import { OrderType, PaymentMethod } from './PreOrderEnums';
import { SHIPPING_FEE_CONFIG } from './PreOrderConstants';

export class PreOrderService {
  /**
   * Calculate shipping fee based on order type
   * TODO: Replace with actual API call using store location and user location
   */
  static calculateShippingFee(orderType: OrderType, subtotal: number): number {
    if (orderType !== OrderType.DELIVERY) {
      return 0;
    }
    
    // TODO: Implement distance-based calculation using Google Maps API
    // For now, use flat rate
    if (subtotal >= SHIPPING_FEE_CONFIG.FREE_SHIPPING_THRESHOLD) {
      return 0;
    }
    
    return SHIPPING_FEE_CONFIG.FLAT_RATE_VND;
  }

  static calculateTotalPrice(subtotal: number, shippingFee: number): number {
    return subtotal + shippingFee;
  }

  static formatPrice(price: number): string {
    return `${price.toLocaleString('vi-VN')}đ`;
  }

  /**
   * Check if payment method is available
   * TODO: Connect to payment gateway availability API
   */
  static isPaymentMethodAvailable(method: PaymentMethod): boolean {
    // only CASH is available now
    return method === PaymentMethod.CASH;
  }

  static validateOrder(itemsCount: number, storeId: string | null, paymentMethod: PaymentMethod): { valid: boolean; error?: string } {
    if (itemsCount === 0) {
      return { valid: false, error: 'Giỏ hàng trống' };
    }
    
    if (!storeId) {
      return { valid: false, error: 'Chưa chọn cửa hàng' };
    }
    
    if (!this.isPaymentMethodAvailable(paymentMethod)) {
      return { valid: false, error: 'Phương thức thanh toán không khả dụng' };
    }
    
    return { valid: true };
  }

  static getOrderTypeIcon(orderType: OrderType): string {
    switch (orderType) {
      case OrderType.DELIVERY:
        return 'bicycle-outline';
      case OrderType.TAKEAWAY:
        return 'bag-handle-outline';
      case OrderType.DINE_IN:
        return 'restaurant-outline';
      default:
        return 'help-circle-outline';
    }
  }

  static getPaymentMethodIcon(method: PaymentMethod): string {
    switch (method) {
      case PaymentMethod.CASH:
        return 'cash-outline';
      case PaymentMethod.VNPAY:
        return 'card-outline';
      case PaymentMethod.MOMO:
        return 'wallet-outline';
      default:
        return 'help-circle-outline';
    }
  }
}