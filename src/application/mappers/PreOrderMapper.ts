import { PreOrder } from '../../domain/entities/PreOrder';
import { CreatePreOrderParams } from '../../domain/repositories/PreOrderRepository';
import { CreatePreOrderRequestDTO, CreatePreOrderResponseDTO } from '../dto/PreOrderDTO';

export class PreOrderMapper {
  static toRequestDTO(params: CreatePreOrderParams): CreatePreOrderRequestDTO {
    const now = new Date().toISOString();

    return {
      user_id: params.userId,
      dateTimeCreated: now,
      dateTimeUpdated: now,
      orderType: params.orderType,
      orderStatus: 'PENDING_PAYMENT',
      paymentMethod: params.paymentMethod,
      store_id: params.storeId,
      items: params.items.map(item => ({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        size: item.size,
        ice: item.ice,
        sweetness: item.sweetness,
        toppings: item.toppings,
      })),
      promotions: params.promotions,
    };
  }

  static toEntity(dto: CreatePreOrderResponseDTO): PreOrder {
    const { order } = dto;
    return {
      preorderId: order.preorder_id,
      subtotal: order.subtotal,
      discountAmount: order.discount_amount,
      deliveryFee: order.delivery_fee,
      finalAmount: order.final_amount,
      createdAt: new Date(),
    };
  }

  static toSerializable(entity: PreOrder) {
    return {
      preorderId: entity.preorderId,
      subtotal: entity.subtotal,
      discountAmount: entity.discountAmount,
      deliveryFee: entity.deliveryFee,
      finalAmount: entity.finalAmount,
      createdAt: entity.createdAt.toISOString(),
    };
  }
}