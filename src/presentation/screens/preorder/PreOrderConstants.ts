import { OrderType, PaymentMethod } from './PreOrderEnums';

export const PREORDER_TEXT = {
  // Header
  TITLE: 'Xác nhận đơn hàng',
  CLEAR_BUTTON: 'Xóa',
  CLOSE_BUTTON: '✕',
  
  // Clear confirmation dialog
  CONFIRM_CLEAR_TITLE: 'Xác nhận',
  CONFIRM_CLEAR_MESSAGE: 'Xóa toàn bộ sản phẩm đã chọn?',
  CONFIRM_CLEAR_CANCEL: 'Hủy',
  CONFIRM_CLEAR_CONFIRM: 'Xóa',
  
  // Order Type Section
  ORDER_TYPE_SECTION_TITLE: 'Tự đến lấy hàng',
  ORDER_TYPE_MODAL_TITLE: 'Chọn phương thức đặt hàng',
  ORDER_TYPE_CHANGE: 'Thay đổi',
  
  // Product List Section
  PRODUCT_LIST_TITLE: 'Sản phẩm đã chọn',
  ADD_MORE_BUTTON: '+Thêm',
  SWIPE_EDIT: 'Sửa',
  SWIPE_DELETE: 'Xóa',
  
  // Total Price Section
  TOTAL_SECTION_TITLE: 'Tổng cộng',
  SUBTOTAL_LABEL: 'Thành tiền',
  SHIPPING_FEE_LABEL: 'Phí giao hàng',
  PROMOTION_LABEL: 'Chọn khuyến mãi/đổi bean',
  FINAL_TOTAL_LABEL: 'Số tiền thanh toán',
  
  // Payment Section
  PAYMENT_SECTION_TITLE: 'Thanh toán',
  PAYMENT_SELECT_BUTTON: 'Chọn phương thức thanh toán >',
  PAYMENT_MODAL_TITLE: 'Phương thức thanh toán',
  
  // Footer
  PLACE_ORDER_BUTTON: 'ĐẶT HÀNG',
  
  // Success
  ORDER_SUCCESS_TITLE: 'Đặt hàng thành công',
  ORDER_SUCCESS_MESSAGE: 'Đơn hàng của bạn đã được ghi nhận',
  
  // Coming Soon
  COMING_SOON_MESSAGE: 'Tính năng đang được phát triển',
};

export const ORDER_TYPE_LABELS: Record<OrderType, string> = {
  [OrderType.DELIVERY]: 'Giao hàng',
  [OrderType.TAKEAWAY]: 'Mang đi',
  [OrderType.DINE_IN]: 'Dùng tại chỗ',
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  [PaymentMethod.CASH]: 'Tiền mặt',
  [PaymentMethod.VNPAY]: 'VNPay',
  [PaymentMethod.MOMO]: 'Momo',
};

export const ORDER_TYPE_SECTION_TITLES: Record<OrderType, string> = {
  [OrderType.DELIVERY]: 'Giao hàng',
  [OrderType.TAKEAWAY]: 'Tự đến lấy hàng',
  [OrderType.DINE_IN]: 'Dùng tại chỗ',
};

// TODO: Fetch from API - Shipping fee calculation config
export const SHIPPING_FEE_CONFIG = {
  FLAT_RATE_VND: 15000,
  FREE_SHIPPING_THRESHOLD: 200000,
};