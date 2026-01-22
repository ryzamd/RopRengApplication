import { OrderRepositoryImpl } from '@/src/infrastructure/repositories/OrderRepositoryImpl';
import { GetOrderDetail } from '../../../application/usecases/orders/GetOrderDetail';
import { Order } from '../../../domain/entities/Order';

export class OrderDetailService {
  private repository = new OrderRepositoryImpl();

  async loadOrderDetail(orderId: number): Promise<Order> {
    const useCase = new GetOrderDetail(this.repository);
    return useCase.execute(orderId);
  }

  formatCurrency(amount: number | string): string {
    const num = typeof amount === 'number' ? amount : parseFloat(amount);
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

  getOptionLabel(key: string, value: string): string {
    const labels: Record<string, Record<string, string>> = {
      size: { small: 'Nhỏ', medium: 'Vừa', large: 'Lớn' },
      ice: { no: 'Không đá', less: 'Ít đá', normal: 'Đá vừa', more: 'Nhiều đá', separate: 'Đá riêng' },
      sweetness: { no: 'Không đường', less: 'Ít đường', normal: 'Đường vừa', more: 'Nhiều đường' },
    };
    return labels[key]?.[value] || value;
  }
}