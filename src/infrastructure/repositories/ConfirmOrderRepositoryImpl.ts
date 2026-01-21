import { AxiosError } from 'axios';
import { ConfirmOrderMapper, ConfirmOrderResponseDTO } from '../../application/mappers/ConfirmOrderMapper';
import { NetworkError } from '../../core/errors/AppErrors';
import { ConfirmOrder } from '../../domain/entities/ConfirmOrder';
import { ConfirmOrderParams, ConfirmOrderRepository } from '../../domain/repositories/ConfirmOrderRepository';
import { CONFIRM_ORDER_ENDPOINTS } from '../api/confirm-order/ConfirmOrderApiConfig';
import { httpClient } from '../http/HttpClient';

/**
 * Implementation of ConfirmOrderRepository
 * Handles API communication for order confirmation
 */
export class ConfirmOrderRepositoryImpl implements ConfirmOrderRepository {
    private static instance: ConfirmOrderRepositoryImpl;

    private constructor() { }

    public static getInstance(): ConfirmOrderRepositoryImpl {
        if (!ConfirmOrderRepositoryImpl.instance) {
            ConfirmOrderRepositoryImpl.instance = new ConfirmOrderRepositoryImpl();
        }
        return ConfirmOrderRepositoryImpl.instance;
    }

    /**
     * Confirm a pre-order
     * API: POST /orders/confirm/:id with body { id: preorder_id }
     */
    async confirm(params: ConfirmOrderParams): Promise<ConfirmOrder> {
        try {
            const endpoint = CONFIRM_ORDER_ENDPOINTS.CONFIRM(params.preorderId);

            const response = await httpClient.post<ConfirmOrderResponseDTO>(
                endpoint,
                { id: params.preorderId }
            );

            return ConfirmOrderMapper.toEntity(response);
        } catch (error) {
            if (error instanceof AxiosError) {
                if (!error.response) {
                    throw new NetworkError();
                }

                const message = error.response.data?.message || 'Không thể xác nhận đơn hàng';
                throw new Error(message);
            }

            throw new Error('Đã có lỗi xảy ra khi xác nhận đơn hàng');
        }
    }
}

export const confirmOrderRepository = ConfirmOrderRepositoryImpl.getInstance();
