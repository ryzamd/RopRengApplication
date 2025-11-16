/**
 * Payment Status
 * Enumeration for payment states
 */

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

/**
 * Get human-readable status
 */
export function getPaymentStatusLabel(status: PaymentStatus): string {
  const labels: Record<PaymentStatus, string> = {
    [PaymentStatus.PENDING]: 'Chờ thanh toán',
    [PaymentStatus.PROCESSING]: 'Đang xử lý',
    [PaymentStatus.SUCCESS]: 'Thành công',
    [PaymentStatus.FAILED]: 'Thất bại',
    [PaymentStatus.REFUNDED]: 'Đã hoàn tiền',
  };

  return labels[status];
}

/**
 * Check if status is terminal
 */
export function isTerminalPaymentStatus(status: PaymentStatus): boolean {
  return (
    status === PaymentStatus.SUCCESS ||
    status === PaymentStatus.FAILED ||
    status === PaymentStatus.REFUNDED
  );
}
