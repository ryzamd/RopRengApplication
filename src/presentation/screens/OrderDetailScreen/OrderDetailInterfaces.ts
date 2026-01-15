import { Order } from '../../../domain/entities/Order';

export interface OrderDetailScreenProps {}

export interface OrderDetailState {
  order: Order | null;
  loading: boolean;
  error: string | null;
}