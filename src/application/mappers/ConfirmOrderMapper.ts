import { ConfirmOrder } from '../../domain/entities/ConfirmOrder';
import { ConfirmOrderItem, ItemOptions, ToppingOption } from '../../domain/entities/ConfirmOrderItem';
import { ConfirmOrderItemResponseDTO, ConfirmOrderResponseDTO } from '../dto/ConfirmOrderDTO';

export class ConfirmOrderMapper {
    static toEntity(dto: ConfirmOrderResponseDTO): ConfirmOrder {
        const order = dto.order;
        const items = order.order_items.map((item) => this.mapItem(item));

        return {
            id: order.id,
            orderCode: order.order_code,
            userId: order.user_id,
            storeId: order.store_id,
            source: order.source,
            subtotal: parseFloat(order.subtotal),
            totalAmount: parseFloat(order.total_amount),
            deliveryFee: parseFloat(order.delivery_fee),
            discountAmount: parseFloat(order.discount_amount),
            finalAmount: parseFloat(order.final_amount),
            paymentMethod: order.payment_method,
            paymentStatus: order.payment_status,
            orderStatus: order.order_status,
            address: order.address,
            contactName: order.contact_name,
            contactPhone: order.contact_phone,
            note: order.note,
            items,
            createdAt: new Date(order.created_at),
            updatedAt: new Date(order.updated_at),
        };
    }

    private static mapItem(dto: ConfirmOrderItemResponseDTO): ConfirmOrderItem {
        const options: ItemOptions = {
            size: dto.options.size || 'medium',
            ice: dto.options.ice || 'normal',
            sweetness: dto.options.sweetness || 'normal',
            toppings: (dto.options.toppings || []).map((t: { id: string; name?: string; price?: number }): ToppingOption => ({
                id: t.id,
                name: t.name,
                price: t.price,
            })),
        };

        return {
            id: dto.id,
            orderId: dto.order_id,
            productId: dto.product_id,
            menuItemId: dto.menu_item_id,
            name: dto.name,
            quantity: dto.qty,
            unitPrice: parseFloat(dto.unit_price),
            totalPrice: parseFloat(dto.total_price),
            options,
            createdAt: new Date(dto.created_at),
        };
    }

    static toSerializable(entity: ConfirmOrder) {
        return {
            id: entity.id,
            orderCode: entity.orderCode,
            userId: entity.userId,
            storeId: entity.storeId,
            source: entity.source,
            subtotal: entity.subtotal,
            totalAmount: entity.totalAmount,
            deliveryFee: entity.deliveryFee,
            discountAmount: entity.discountAmount,
            finalAmount: entity.finalAmount,
            paymentMethod: entity.paymentMethod,
            paymentStatus: entity.paymentStatus,
            orderStatus: entity.orderStatus,
            address: entity.address,
            contactName: entity.contactName,
            contactPhone: entity.contactPhone,
            note: entity.note,
            items: entity.items.map((item) => ({
                id: item.id,
                orderId: item.orderId,
                productId: item.productId,
                menuItemId: item.menuItemId,
                name: item.name,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.totalPrice,
                options: item.options,
                createdAt: item.createdAt.toISOString(),
            })),
            createdAt: entity.createdAt.toISOString(),
            updatedAt: entity.updatedAt.toISOString(),
        };
    }
}
