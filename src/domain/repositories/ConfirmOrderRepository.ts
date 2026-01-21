import { ConfirmOrder } from '../entities/ConfirmOrder';

/**
 * Parameters for confirming an order
 */
export interface ConfirmOrderParams {
    preorderId: number;
}

/**
 * Repository interface for Confirm Order operations
 */
export interface ConfirmOrderRepository {
    /**
     * Confirm a pre-order
     * @param params - Contains preorderId
     * @returns Confirmed order details
     */
    confirm(params: ConfirmOrderParams): Promise<ConfirmOrder>;
}
