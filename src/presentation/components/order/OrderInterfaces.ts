import { OrderType } from '../../screens/preorder/PreOrderEnums';

/**
 * Generic order item interface for display in both Pre-order and Confirm Order screens.
 * This interface abstracts the differences between CartItem (local) and ConfirmOrderItem (API).
 */
export interface OrderDisplayItem {
    id: string | number;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    options: OrderItemOptions;
    /** Original item reference for edit operations */
    originalItem?: unknown;
}

export interface OrderItemOptions {
    size: string;
    ice: string;
    sweetness: string;
    toppings: OrderToppingOption[];
}

export interface OrderToppingOption {
    id: string;
    name: string;
    price?: number;
}

/**
 * Props for OrderProductItem component
 */
export interface OrderProductItemProps {
    item: OrderDisplayItem;
    onPress?: (item: OrderDisplayItem) => void;
    editable?: boolean;
}

/**
 * Props for OrderProductList component
 */
export interface OrderProductListProps {
    items: OrderDisplayItem[];
    title?: string;
    onItemPress?: (item: OrderDisplayItem) => void;
    onAddMore?: () => void;
    showAddButton?: boolean;
    editable?: boolean;
    emptyText?: string;
}

/**
 * Props for OrderPriceSection component
 */
export interface OrderPriceSectionProps {
    subtotal: number;
    shippingFee: number;
    discountAmount?: number;
    onPromotionPress?: () => void;
    showPromotionButton?: boolean;
}

/**
 * Props for OrderAddressCard component
 */
export interface OrderAddressCardProps {
    orderType: OrderType;
    address?: {
        name: string;
        full: string;
    } | null;
    onChangeAddress?: () => void;
    editable?: boolean;
}

/**
 * Props for OrderFooter component
 */
export interface OrderFooterProps {
    orderType: OrderType;
    totalItems: number;
    totalPrice: number;
    buttonText: string;
    onButtonPress: () => void;
    isLoading?: boolean;
}
