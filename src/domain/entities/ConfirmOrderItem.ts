import { ItemOptions, ToppingOption } from './shared/OrderTypes';

export type { ItemOptions, ToppingOption };

export interface ConfirmOrderItem {
  readonly id: number;
  readonly orderId: number;
  readonly productId: number | null;
  readonly menuItemId: number;
  readonly name: string;
  readonly quantity: number;
  readonly unitPrice: number;
  readonly totalPrice: number;
  readonly options: ItemOptions;
  readonly createdAt: Date;
}