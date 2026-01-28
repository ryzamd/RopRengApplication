import { ConfirmOrder } from '../entities/ConfirmOrder';

export interface ConfirmOrderParams {
    preorderId: number;
}

export interface ConfirmOrderRepository {
    confirm(params: ConfirmOrderParams): Promise<ConfirmOrder>;
}
