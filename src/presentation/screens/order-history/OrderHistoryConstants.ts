import { OrderStatus } from './OrderHistoryEnums';
import { StatusChipData } from './OrderHistoryInterfaces';

export const ORDER_HISTORY_STRINGS = {
  TITLE: 'Lịch sử đơn hàng',
  EMPTY_TITLE: 'Chưa có đơn hàng nào',
  EMPTY_MESSAGE: 'Bạn chưa có đơn hàng nào.\nHãy bắt đầu đặt món yêu thích nhé!',
  ERROR_LOAD: 'Không thể tải lịch sử đơn hàng',
  RETRY: 'Thử lại',
  LOADING: 'Đang tải...',
  LOAD_MORE: 'Tải thêm',
};

export const STATUS_CHIPS: StatusChipData[] = [
  { status: OrderStatus.ALL, label: 'Tất cả', isSelected: true },
  { status: OrderStatus.PENDING, label: 'Chờ xác nhận', isSelected: false },
  { status: OrderStatus.CONFIRMED, label: 'Đã xác nhận', isSelected: false },
  { status: OrderStatus.PREPARING, label: 'Đang chuẩn bị', isSelected: false },
  { status: OrderStatus.READY, label: 'Sẵn sàng', isSelected: false },
  { status: OrderStatus.DELIVERING, label: 'Đang giao', isSelected: false },
  { status: OrderStatus.COMPLETED, label: 'Hoàn thành', isSelected: false },
  { status: OrderStatus.CANCELLED, label: 'Đã hủy', isSelected: false },
];

export const ITEMS_PER_PAGE = 10;

export const STATUS_COLORS: Record<string, string> = {
  pending: '#FFA726',
  confirmed: '#42A5F5',
  preparing: '#AB47BC',
  ready: '#66BB6A',
  delivering: '#26C6DA',
  completed: '#4CAF50',
  cancelled: '#EF5350',
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: 'Chờ thanh toán',
  paid: 'Đã thanh toán',
  failed: 'Thanh toán thất bại',
  refunded: 'Đã hoàn tiền',
};

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  preparing: 'Đang chuẩn bị',
  ready: 'Sẵn sàng',
  delivering: 'Đang giao',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
};