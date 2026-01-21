import { OrderType } from '../../screens/preorder/PreOrderEnums';
import { ICE_LABELS, SIZE_LABELS, SWEETNESS_LABELS } from './OrderConstants';
import { OrderDisplayItem, OrderItemOptions } from './OrderInterfaces';

/**
 * Shared service utilities for order components
 */
export class OrderService {
    /**
     * Format price to Vietnamese currency string
     */
    static formatPrice(price: number): string {
        return `${price.toLocaleString('vi-VN')}đ`;
    }

    /**
     * Calculate total price with shipping fee
     */
    static calculateTotalPrice(subtotal: number, shippingFee: number, discountAmount: number = 0): number {
        return Math.max(0, subtotal + shippingFee - discountAmount);
    }

    /**
     * Get display label for size option
     */
    static getSizeLabel(size: string): string {
        return SIZE_LABELS[size] || size;
    }

    /**
     * Get display label for ice option
     */
    static getIceLabel(ice: string): string {
        return ICE_LABELS[ice] || ice;
    }

    /**
     * Get display label for sweetness option
     */
    static getSweetnessLabel(sweetness: string): string {
        return SWEETNESS_LABELS[sweetness] || sweetness;
    }

    /**
     * Format item options to display string
     */
    static formatOptionsText(options: OrderItemOptions): string {
        const parts: string[] = [];

        if (options.size) {
            parts.push(this.getSizeLabel(options.size));
        }
        if (options.ice) {
            parts.push(this.getIceLabel(options.ice));
        }
        if (options.sweetness) {
            parts.push(this.getSweetnessLabel(options.sweetness));
        }

        return parts.join(' · ');
    }

    /**
     * Get order type icon name
     */
    static getOrderTypeIcon(orderType: OrderType): string {
        switch (orderType) {
            case OrderType.DELIVERY:
                return 'bicycle-outline';
            case OrderType.TAKEAWAY:
                return 'bag-handle-outline';
            case OrderType.DINE_IN:
                return 'restaurant-outline';
            default:
                return 'help-circle-outline';
        }
    }

    /**
     * Calculate total items count from display items
     */
    static getTotalItemsCount(items: OrderDisplayItem[]): number {
        return items.reduce((sum, item) => sum + item.quantity, 0);
    }
}
