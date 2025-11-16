/**
 * Payment Method
 * Enumeration for payment methods
 */

export enum PaymentMethod {
  CASH = 'CASH',
  VNPAY = 'VNPAY',
  MOMO = 'MOMO',
  LOYALTY_POINTS = 'LOYALTY_POINTS',
}

/**
 * Get human-readable method name
 */
export function getPaymentMethodLabel(method: PaymentMethod): string {
  const labels: Record<PaymentMethod, string> = {
    [PaymentMethod.CASH]: 'Tiền mặt',
    [PaymentMethod.VNPAY]: 'VNPay',
    [PaymentMethod.MOMO]: 'MoMo',
    [PaymentMethod.LOYALTY_POINTS]: 'Điểm thưởng',
  };

  return labels[method];
}

/**
 * Check if method requires online processing
 */
export function requiresOnlineProcessing(method: PaymentMethod): boolean {
  return method === PaymentMethod.VNPAY || method === PaymentMethod.MOMO;
}
