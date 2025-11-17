/**
 * Order Repository Interface
 * Contract for order data access
 */

import { IRepository } from './IRepository';
import { Order } from '../entities/order/Order';
import { OrderStatus } from '../entities/order/OrderStatus';

export interface IOrderRepository extends IRepository<Order> {
  /**
   * Find orders by user ID
   */
  findByUserId(userId: string, options?: {
    limit?: number;
    offset?: number;
  }): Promise<Order[]>;

  /**
   * Find orders by status
   */
  findByStatus(status: OrderStatus): Promise<Order[]>;

  /**
   * Find active orders (not completed/cancelled)
   */
  findActive(): Promise<Order[]>;

  /**
   * Find recent orders
   */
  findRecent(userId: string, limit?: number): Promise<Order[]>;
}
