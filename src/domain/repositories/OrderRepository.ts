import { ConfirmOrder } from '../entities/ConfirmOrder';
import { Order } from '../entities/Order';

export interface OrderRepository {
  getOrderHistory(userUuid: string, page: number, limit: number, statuses?: string[]): Promise<{
    orders: Order[];
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  }>;
  
  getOrderDetail(orderId: number): Promise<Order>;
  confirmOrder(payload: ConfirmOrder): Promise<Order>;
}