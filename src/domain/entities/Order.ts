import { OrderItemOptions } from './shared/OrderTypes';

export type { OrderItemOptions };

export interface Order {
  readonly id: number;
  readonly orderCode: string;
  readonly userId: number;
  readonly storeId: number;
  readonly source: string;
  readonly subtotal: number;
  readonly totalAmount: number;
  readonly deliveryFee: number;
  readonly discountAmount: number;
  readonly finalAmount: number;
  readonly paymentMethod: string;
  readonly paymentStatus: string;
  readonly orderStatus: string;
  readonly address: string | null;
  readonly contactName: string | null;
  readonly contactPhone: string | null;
  readonly note: string | null;
  readonly createdAt: string;
  readonly updatedAt: string | null;
  readonly deletedAt: string | null;
  readonly items: OrderItem[];
}

export interface OrderItem {
  readonly id: number;
  readonly orderId: number;
  readonly productId: number | null;
  readonly menuItemId: number;
  readonly name: string;
  readonly qty: number;
  readonly unitPrice: number;
  readonly totalPrice: number;
  readonly options: OrderItemOptions;
  readonly createdAt: string;
}
