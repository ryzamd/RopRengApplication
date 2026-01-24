/**
 * Confirm Order Screen constants
 */
export const CONFIRM_ORDER_TEXT = {
    // Screen
    SCREEN_TITLE: 'Xác nhận đơn hàng',

    // Header
    BACK_BUTTON: 'Quay lại',

    // Actions
    CONFIRM_BUTTON: 'XÁC NHẬN',
    CANCEL_BUTTON: 'Hủy',

    // Messages
    LOADING_MESSAGE: 'Đang tải...',
    CONFIRM_SUCCESS_TITLE: 'Xác nhận thành công',
    CONFIRM_SUCCESS_MESSAGE: 'Đơn hàng của bạn đã được xác nhận',
    CONFIRM_ERROR_TITLE: 'Lỗi',

    // Empty state
    NO_ORDER_TITLE: 'Không tìm thấy đơn hàng',
    NO_ORDER_MESSAGE: 'Vui lòng thử lại',

    // Payment
    PAYMENT_SECTION_TITLE: 'Phương thức thanh toán',

    // Voucher notice
    VOUCHER_NOTICE: 'Không thể thay đổi mã giảm giá ở bước này',
};

/**
 * Payment method labels for display
 */
export const PAYMENT_METHOD_LABELS: Record<string, string> = {
    cod: 'Thanh toán khi nhận hàng',
    cash: 'Tiền mặt',
    vietqr: 'VietQR',
    vnpay: 'VNPay',
    momo: 'Momo',
};
