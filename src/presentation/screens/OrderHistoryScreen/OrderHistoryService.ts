import { OrderRepositoryImpl } from '@/src/infrastructure/repositories/OrderRepositoryImpls';
import { GetOrderHistory } from '../../../application/usecases/orders/GetOrderHistory';
import { Order } from '../../../domain/entities/Order';

export class OrderHistoryService {
  private repository = new OrderRepositoryImpl();

  async loadOrders(userUuid: string, page: number, limit: number, statuses?: string[]): Promise<{
    orders: Order[];
    total: number;
    totalPages: number;
    hasMore: boolean;
  }> {
    const useCase = new GetOrderHistory(this.repository);
    const result = await useCase.execute(userUuid, page, limit, statuses);

    return {
      orders: result.orders,
      total: result.total,
      totalPages: result.totalPages,
      hasMore: page < result.totalPages - 1,
    };
  }

  formatCurrency(amount: string): string {
    const num = parseFloat(amount);
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(num);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }

  getStoreLabel(storeId: number): string {
    return `Cửa hàng #${storeId}`;
  }
}