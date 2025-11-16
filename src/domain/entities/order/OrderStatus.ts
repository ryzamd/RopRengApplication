/**
 * Order Status
 * Enumeration for order states
 */

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  DELIVERING = 'DELIVERING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

/**
 * Get human-readable status
 */
export function getOrderStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: 'Chờ xác nhận',
    [OrderStatus.CONFIRMED]: 'Đã xác nhận',
    [OrderStatus.PREPARING]: 'Đang chuẩn bị',
    [OrderStatus.READY]: 'Sẵn sàng',
    [OrderStatus.DELIVERING]: 'Đang giao',
    [OrderStatus.COMPLETED]: 'Hoàn thành',
    [OrderStatus.CANCELLED]: 'Đã hủy',
  };

  return labels[status];
}

/**
 * Check if status is terminal (cannot change)
 */
export function isTerminalStatus(status: OrderStatus): boolean {
  return status === OrderStatus.COMPLETED || status === OrderStatus.CANCELLED;
}

/**
 * Get next allowed statuses
 */
export function getNextStatuses(current: OrderStatus): OrderStatus[] {
  const transitions: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
    [OrderStatus.CONFIRMED]: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
    [OrderStatus.PREPARING]: [OrderStatus.READY, OrderStatus.CANCELLED],
    [OrderStatus.READY]: [OrderStatus.DELIVERING, OrderStatus.COMPLETED, OrderStatus.CANCELLED],
    [OrderStatus.DELIVERING]: [OrderStatus.COMPLETED, OrderStatus.CANCELLED],
    [OrderStatus.COMPLETED]: [],
    [OrderStatus.CANCELLED]: [],
  };

  return transitions[current] || [];
}
