import { PreOrder, PreOrderItem } from '../entities/PreOrder';

export interface CreatePreOrderParams {
  userId: string;
  orderType: 'DELIVERY' | 'TAKEAWAY';
  paymentMethod: string;
  storeId: number;
  items: PreOrderItem[];
  promotions: { promotionId: string }[];
}

export interface PreOrderRepository {
  create(params: CreatePreOrderParams): Promise<PreOrder>;
}