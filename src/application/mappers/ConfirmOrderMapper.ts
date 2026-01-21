import { ConfirmOrder, DeliveryAddress } from '../../domain/entities/ConfirmOrder';
import { ConfirmOrderItem, ItemOptions, ToppingOption } from '../../domain/entities/ConfirmOrderItem';

/**
 * Response DTO from Confirm Order API
 */
export interface ConfirmOrderResponseDTO {
    order: {
        id: number;
        order_code: string;
        user_id: number;
        store_id: number;
        staff_user_id: number | null;
        pos_id: number | null;
        source: string;
        subtotal: string;
        total_amount: string;
        delivery_fee: string;
        discount_amount: string;
        final_amount: string;
        payment_method: string;
        payment_status: string;
        order_status: string;
        address: DeliveryAddress | null;
        contact_name: string | null;
        contact_phone: string | null;
        note: string | null;
        created_at: string;
        updated_at: string;
        deleted_at: string | null;
        order_items: ConfirmOrderItemDTO[];
    };
}

export interface ConfirmOrderItemDTO {
    id: number;
    order_id: number;
    product_id: number | null;
    menu_item_id: number;
    name: string;
    qty: number;
    unit_price: string;
    total_price: string;
    options: {
        ice: string;
        size: string;
        toppings: Array<{ id: string; name?: string; price?: number }>;
        sweetness: string;
    };
    created_at: string;
}

/**
 * Mapper to convert API response to domain entity
 */
export class ConfirmOrderMapper {
    static toEntity(dto: ConfirmOrderResponseDTO): ConfirmOrder {
        const order = dto.order;
        const items = order.order_items.map((item) => this.mapItem(item));

        return new ConfirmOrder(
            order.id,
            order.order_code,
            order.user_id,
            order.store_id,
            order.source,
            parseFloat(order.subtotal),
            parseFloat(order.total_amount),
            parseFloat(order.delivery_fee),
            parseFloat(order.discount_amount),
            parseFloat(order.final_amount),
            order.payment_method,
            order.payment_status,
            order.order_status,
            order.address,
            order.contact_name,
            order.contact_phone,
            order.note,
            items,
            new Date(order.created_at),
            new Date(order.updated_at)
        );
    }

    private static mapItem(dto: ConfirmOrderItemDTO): ConfirmOrderItem {
        const options: ItemOptions = {
            size: dto.options.size || 'medium',
            ice: dto.options.ice || 'normal',
            sweetness: dto.options.sweetness || 'normal',
            toppings: (dto.options.toppings || []).map((t): ToppingOption => ({
                id: t.id,
                name: t.name,
                price: t.price,
            })),
        };

        return new ConfirmOrderItem(
            dto.id,
            dto.order_id,
            dto.product_id,
            dto.menu_item_id,
            dto.name,
            dto.qty,
            parseFloat(dto.unit_price),
            parseFloat(dto.total_price),
            options,
            new Date(dto.created_at)
        );
    }

    /**
     * Convert domain entity to serializable format for Redux state
     */
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
