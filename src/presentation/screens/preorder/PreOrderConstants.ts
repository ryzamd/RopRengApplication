import { OrderType, PaymentMethod } from '../../../domain/shared';

export const PREORDER_TEXT = {
  TITLE: 'Xác nhận đơn hàng',
  CLEAR_BUTTON: 'Xóa',
  CONFIRM_CLEAR_TITLE: 'Xác nhận',
  CONFIRM_CLEAR_MESSAGE: 'Xóa toàn bộ sản phẩm đã chọn?',
  CONFIRM_CLEAR_CANCEL: 'Hủy',
  CONFIRM_CLEAR_CONFIRM: 'Xóa',
  ORDER_TYPE_SECTION_TITLE: 'Tự đến lấy hàng',
  ORDER_TYPE_MODAL_TITLE: 'Chọn phương thức đặt hàng',
  ORDER_TYPE_CHANGE: 'Thay đổi',
  PRODUCT_LIST_TITLE: 'Sản phẩm đã chọn',
  ADD_MORE_BUTTON: '+Thêm',
  SWIPE_EDIT: 'Sửa',
  SWIPE_DELETE: 'Xóa',
  TOTAL_SECTION_TITLE: 'Tổng cộng',
  SUBTOTAL_LABEL: 'Thành tiền',
  SHIPPING_FEE_LABEL: 'Phí giao hàng',
  PROMOTION_LABEL: 'Chọn khuyến mãi',
  FINAL_TOTAL_LABEL: 'Số tiền thanh toán',
  PAYMENT_SECTION_TITLE: 'Thanh toán',
  PAYMENT_SELECT_BUTTON: 'Chọn phương thức thanh toán >',
  PAYMENT_MODAL_TITLE: 'Phương thức thanh toán',
  PLACE_ORDER_BUTTON: 'ĐẶT HÀNG',
  ORDER_SUCCESS_TITLE: 'Đặt hàng thành công',
  ORDER_SUCCESS_MESSAGE: 'Đơn hàng của bạn đã được ghi nhận',
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

export const SIZE_OPTIONS = [
  { id: 'large', label: 'Lớn', priceAdjust: 10000 },
  { id: 'medium', label: 'Vừa', priceAdjust: 0 },
  { id: 'small', label: 'Nhỏ', priceAdjust: -10000 },
] as const;

export const ICE_OPTIONS = [
  { id: 'normal', label: 'Bình Thường' },
  { id: 'separate', label: 'Đá Riêng' },
  { id: 'less', label: 'Ít Đá' },
] as const;

export const SWEETNESS_OPTIONS = [
  { id: 'normal', label: 'Bình thường' },
  { id: 'less', label: 'Ít ngọt' },
  { id: 'more', label: 'Thêm ngọt' },
] as const;

export const EDIT_PRODUCT_TEXT = {
  SIZE_LABEL: 'Size',
  SIZE_HINT: 'Chọn 1 loại size',
  ICE_LABEL: 'Lượng đá',
  SWEETNESS_LABEL: 'Độ ngọt',
  TOPPING_LABEL: 'THÊM LỰA CHỌN',
  TOPPING_HINT: 'Tùy chọn thêm sữa, syrup hay topping yêu thích để Nhà pha dùng gụ bạn nhất (Một số lựa chọn có phụ phí).',
  NOTE_LABEL: 'Thêm ghi chú',
  CHANGE_BUTTON: 'Thay đổi',
  DELETE_CONFIRM_TITLE: 'Xác nhận',
  DELETE_CONFIRM_MESSAGE: 'Sản phẩm sẽ bị xóa khỏi giỏ hàng. Bạn có chắc chắn?',
  DELETE_CONFIRM_CANCEL: 'Hủy',
  DELETE_CONFIRM_OK: 'Xác nhận',
};

export const TOPPING_TEXT = {
  TITLE: 'Topping mua kèm món',
  SUBTITLE: 'Chọn tối đa 3 loại Topping',
  APPLY_BUTTON: 'Áp dụng',
};