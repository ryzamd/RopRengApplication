import { Order } from '../../../domain/entities/Order';
import { OrderStatus } from './OrderHistoryEnums';

export interface OrderHistoryScreenProps {}

export interface StatusChipData {
  status: OrderStatus;
  label: string;
  isSelected: boolean;
}

export interface OrderListState {
  orders: Order[];
  loading: boolean;
  refreshing: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  page: number;
  total: number;
}