import { OrderType } from '../../screens/preorder/PreOrderEnums';

/**
 * Shared text constants for order components
 */
export const ORDER_TEXT = {
    // Product List Section
    PRODUCT_LIST_TITLE: 'Sản phẩm đã chọn',
    ADD_MORE_BUTTON: '+Thêm',
    EMPTY_PRODUCT_TEXT: 'Chưa có sản phẩm nào',

    // Total Price Section
    TOTAL_SECTION_TITLE: 'Tổng cộng',
    SUBTOTAL_LABEL: 'Thành tiền',
    SHIPPING_FEE_LABEL: 'Phí giao hàng',
    DISCOUNT_LABEL: 'Giảm giá',
    PROMOTION_LABEL: 'Chọn khuyến mãi',
    FINAL_TOTAL_LABEL: 'Số tiền thanh toán',

    // Address Section
    ADDRESS_HEADER_TITLE: 'Giao tới',
    ADDRESS_CHANGE_BUTTON: 'Thay đổi',
    ADDRESS_PLACEHOLDER: 'Chọn địa chỉ giao hàng',
};

/**
 * Order type labels for display
 */
export const ORDER_TYPE_LABELS: Record<OrderType, string> = {
    [OrderType.DELIVERY]: 'Giao hàng',
    [OrderType.TAKEAWAY]: 'Mang đi',
    [OrderType.DINE_IN]: 'Dùng tại chỗ',
};

/**
 * Size option labels
 */
export const SIZE_LABELS: Record<string, string> = {
    small: 'Nhỏ',
    medium: 'Vừa',
    large: 'Lớn',
};

/**
 * Ice option labels
 */
export const ICE_LABELS: Record<string, string> = {
    normal: 'Đá bình thường',
    less: 'Ít đá',
    separate: 'Đá riêng',
};

/**
 * Sweetness option labels
 */
export const SWEETNESS_LABELS: Record<string, string> = {
    normal: 'Đường bình thường',
    less: 'Ít đường',
    more: 'Nhiều đường',
};
