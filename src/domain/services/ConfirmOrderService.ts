import { ConfirmOrder } from '../entities/ConfirmOrder';
import { ConfirmOrderItem } from '../entities/ConfirmOrderItem';

export class ConfirmOrderService {
    static hasDeliveryAddress(order: ConfirmOrder): boolean {
        return order.address !== null && order.address.detail.length > 0;
    }

    static hasDiscount(order: ConfirmOrder): boolean {
        return order.discountAmount > 0;
    }

    static getTotalItemsCount(order: ConfirmOrder): number {
        return order.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    static canConfirm(order: ConfirmOrder): { valid: boolean; error: string | null } {
        if (order.items.length === 0) {
            return { valid: false, error: "Đơn hàng không có sản phẩm" };
        }

        if (order.finalAmount <= 0) {
            return { valid: false, error: "Giá trị đơn hàng không hợp lệ" };
        }

        return { valid: true, error: null };
    }

    static canRemoveItem(order: ConfirmOrder): boolean {
        return order.items.length > 1;
    }

    static withUpdatedItems(order: ConfirmOrder, newItems: ConfirmOrderItem[]): ConfirmOrder {
        const newSubtotal = newItems.reduce((sum, item) => sum + item.totalPrice, 0);
        const newFinalAmount = Math.max(0, newSubtotal + order.deliveryFee - order.discountAmount);

        return {
            ...order,
            items: newItems,
            subtotal: newSubtotal,
            totalAmount: newSubtotal,
            finalAmount: newFinalAmount,
        };
    }
}
