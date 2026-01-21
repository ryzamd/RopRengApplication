import { Order, OrderItem } from '../../domain/entities/Order';
import { OrderDTO, OrderItemDTO } from '../dto/OrderDTO';

export class OrderMapper {
  static toDomain(dto: OrderDTO): Order {
    return new Order(
      dto.id,
      dto.order_code,
      dto.user_id,
      dto.store_id,
      dto.source,
      dto.subtotal,
      dto.total_amount,
      dto.delivery_fee,
      dto.discount_amount,
      dto.final_amount,
      dto.payment_method,
      dto.payment_status,
      dto.order_status,
      dto.address,
      dto.contact_name,
      dto.contact_phone,
      dto.note,
      dto.created_at,
      dto.updated_at,
      dto.deleted_at,
      (dto.order_items ?? []).map((item) => OrderMapper.itemToDomain(item))
    );
  }

  static itemToDomain(dto: OrderItemDTO): OrderItem {
    return new OrderItem(
      dto.id,
      dto.order_id,
      dto.product_id,
      dto.menu_item_id,
      dto.name,
      dto.qty,
      dto.unit_price,
      dto.total_price,
      dto.options,
      dto.created_at
    );
  }
}