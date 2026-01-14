import { Order } from '../../../domain/entities/Order';
import { OrderRepository } from '../../../domain/repositories/OrderRepository';

export class GetOrderHistory {
  constructor(private readonly repository: OrderRepository) {}

  async execute(userUuid: string, page: number, limit: number, statuses?: string[]): Promise<{
    orders: Order[];
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  }> {
    return this.repository.getOrderHistory(userUuid, page, limit, statuses);
  }
}