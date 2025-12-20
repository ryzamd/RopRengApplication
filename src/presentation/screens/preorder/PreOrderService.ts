import { OrderType, PaymentMethod } from './PreOrderEnums';

export class PreOrderService {
  /**
   * Calculate total price (subtotal + shipping)
   */
  static calculateTotalPrice(subtotal: number, shippingFee: number): number {
    return subtotal + shippingFee;
  }

  /**
   * DEPRECATED: Use PreOrderAPI.calculateShipping() instead
   * 
   * This was the old client-side calculation.
   * Now shipping fee comes from backend via AhaMove.
   */
  static calculateShippingFee(orderType: OrderType, subtotal: number): number {
    console.warn('[PreOrderService] calculateShippingFee is deprecated. Use PreOrderAPI.calculateShipping()');
    
    if (orderType === OrderType.TAKEAWAY) {
      return 0;
    }

    // Fallback mock calculation (should not be used)
    if (subtotal < 100000) {
      return 15000;
    } else if (subtotal < 200000) {
      return 10000;
    } else {
      return 0; // Free shipping over 200k
    }
  }

  /**
   * Validate order before submission
   */
  static isPaymentMethodAvailable(method: PaymentMethod): boolean {
    // only CASH is available now
    return method === PaymentMethod.CASH;
  }

  static validateOrder(
    totalItems: number,
    storeId: string | null,
    paymentMethod: PaymentMethod,
    orderType: OrderType,
    deliveryAddress?: { latitude: number; longitude: number } | null
  ): { valid: boolean; error?: string } {
    if (totalItems === 0) {
      return { valid: false, error: 'Giỏ hàng trống. Vui lòng thêm sản phẩm.' };
    }

    if (!storeId) {
      return { valid: false, error: 'Vui lòng chọn cửa hàng.' };
    }

    if (!paymentMethod) {
      return { valid: false, error: 'Vui lòng chọn phương thức thanh toán.' };
    }

    // Validate delivery address for DELIVERY orders
    if (orderType === OrderType.DELIVERY) {
      if (!deliveryAddress || !deliveryAddress.latitude || !deliveryAddress.longitude) {
        return { valid: false, error: 'Vui lòng chọn địa chỉ giao hàng.' };
      }
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
  /**
   * Format currency (VND)
   */
  static formatCurrency(amount: number): string {
    return amount.toLocaleString('vi-VN') + 'đ';
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
  /**
   * Format distance
   */
  static formatDistance(km: number): string {
    if (km < 1) {
      return `${(km * 1000).toFixed(0)}m`;
    }
    return `${km.toFixed(1)}km`;
  }
}