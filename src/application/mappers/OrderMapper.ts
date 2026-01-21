import { Order, OrderItem } from '../../domain/entities/Order';
import { OrderDTO, OrderItemDTO } from '../dto/OrderDTO';

export class OrderMapper {
  static toDomain(dto: OrderDTO): Order {
    return {
      id: dto.id,
      orderCode: dto.order_code,
      userId: dto.user_id,
      storeId: dto.store_id,
      source: dto.source,
      subtotal: parseFloat(dto.subtotal),
      totalAmount: parseFloat(dto.total_amount),
      deliveryFee: parseFloat(dto.delivery_fee),
      discountAmount: parseFloat(dto.discount_amount),
      finalAmount: parseFloat(dto.final_amount),
      paymentMethod: dto.payment_method,
      paymentStatus: dto.payment_status,
      orderStatus: dto.order_status,
      address: dto.address,
      contactName: dto.contact_name,
      contactPhone: dto.contact_phone,
      note: dto.note,
      createdAt: dto.created_at,
      updatedAt: dto.updated_at,
      deletedAt: dto.deleted_at,
      items: (dto.order_items ?? []).map((item) => OrderMapper.itemToDomain(item)),
    };
  }

  static itemToDomain(dto: OrderItemDTO): OrderItem {
    return {
      id: dto.id,
      orderId: dto.order_id,
      productId: dto.product_id,
      menuItemId: dto.menu_item_id,
      name: dto.name,
      qty: dto.qty,
      unitPrice: parseFloat(dto.unit_price),
      totalPrice: parseFloat(dto.total_price),
      options: dto.options,
      createdAt: dto.created_at,
    };
  }
}