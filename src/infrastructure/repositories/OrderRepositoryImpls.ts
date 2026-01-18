import { ConfirmOrderRequestDTO, ConfirmOrderVoucherDTO } from '../../application/dto/ConfirmOrderDTO';
import { OrderDTO, OrderHistoryResponseDTO } from '../../application/dto/OrderDTO';
import { OrderMapper } from '../../application/mappers/OrderMapper';
import { ConfirmOrder } from '../../domain/entities/ConfirmOrder';
import { Order } from '../../domain/entities/Order';
import { OrderRepository } from '../../domain/repositories/OrderRepository';
import { ORDER_API } from '../api/confirm-order/ConfirmOrderApiConfig';
import { ORDER_HISTORY_API } from '../api/order-history/OrderHistoryApiConfig';
import { httpClient } from '../http/HttpClient';

export class OrderRepositoryImpl implements OrderRepository {
  async getOrderHistory(userUuid: string, page: number, limit: number, statuses?: string[]): Promise<{
    orders: Order[];
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  }> {
    const params: Record<string, any> = { page, limit };
    
    if (statuses && statuses.length > 0) {
      params.status = statuses.join(',');
    }

    const url = ORDER_HISTORY_API.GET_HISTORY(userUuid);
    const response = await httpClient.get<OrderHistoryResponseDTO>(url, { params });

    return {
      orders: response.orders.map((dto) => OrderMapper.toDomain(dto)),
      total: response.total,
      totalPages: response.total_pages,
      page: response.page,
      limit: response.limit,
    };
  }

  async getOrderDetail(orderId: number): Promise<Order> {
    const url = ORDER_HISTORY_API.GET_DETAIL(orderId);
    const response = await httpClient.get<{ success: boolean; order: any }>(url);
    return OrderMapper.toDomain(response.order);
  }

  async confirmOrder(payload: ConfirmOrder): Promise<Order> {
    const voucherDtos: ConfirmOrderVoucherDTO[] = payload.voucherCodes.map(code => ({
      promotionId: code
    }));

    const body: ConfirmOrderRequestDTO = {
      user_id: payload.userId,
      store_id: payload.storeId,
      items: payload.items.map(item => ({
        menu_item_id: item.menuItemId,
        product_id: item.productId,
        name: item.name,
        qty: item.qty,
        unit_price: item.unitPrice,
        options: {
          toppings: item.toppingIds.map(id => ({ id }))
        }
      })),
      voucher_code: voucherDtos,
      address: {
        lat: payload.address.lat,
        lng: payload.address.lng,
        detail: payload.address.detail
      },
      contact_name: payload.contactName,
      contact_phone: payload.contactPhone,
      note: payload.note
    };

    const response = await httpClient.post<{ success: boolean; data: OrderDTO }>(ORDER_API.CONFIRM, body);
    
    return OrderMapper.toDomain(response.data);
  }
}