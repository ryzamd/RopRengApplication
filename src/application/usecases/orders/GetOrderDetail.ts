import { Order } from '../../../domain/entities/Order';
import { OrderRepository } from '../../../domain/repositories/OrderRepository';

export class GetOrderDetail {
  constructor(private readonly repository: OrderRepository) {}

  async execute(orderId: number): Promise<Order> {
    return this.repository.getOrderDetail(orderId);
  }
}