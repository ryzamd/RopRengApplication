import { MenuSectionData, UtilityItemData } from './MoreInterfaces';

export const MORE_STRINGS = {
  HEADER_TITLE: 'Khác',
  VERSION: 'Phiên bản 1.0.0',
  LOGOUT_CONFIRM_TITLE: 'Đăng xuất',
  LOGOUT_CONFIRM_MSG: 'Bạn có chắc chắn muốn đăng xuất?',
  CANCEL: 'Hủy',
  AGREE: 'Đồng ý',
};

// Danh sách tiện ích (Grid 4 cột)
export const UTILITIES: UtilityItemData[] = [
  { id: 'rewards', label: 'RopReng\nRewards', icon: 'gift-outline' },
  { id: 'vouchers', label: 'Phiếu ưu đãi', icon: 'ticket-outline', badge: 3 },
  { id: 'history', label: 'Lịch sử\nđơn hàng', icon: 'receipt-outline' },
  { id: 'saved', label: 'Món yêu\nthích', icon: 'heart-outline' },
  { id: 'stores', label: 'Cửa hàng', icon: 'storefront-outline' },
  { id: 'rating', label: 'Góp ý', icon: 'chatbox-ellipses-outline' },
];

// Menu Hỗ trợ
export const SUPPORT_MENU: MenuSectionData = {
  title: 'Hỗ trợ',
  items: [
    { id: 'help', label: 'Gửi yêu cầu hỗ trợ', icon: 'help-circle-outline' },
    { id: 'terms', label: 'Điều khoản & Chính sách', icon: 'document-text-outline' },
    { id: 'settings', label: 'Cài đặt', icon: 'settings-outline' },
  ],
};

// Menu Tài khoản
export const ACCOUNT_MENU: MenuSectionData = {
  title: 'Tài khoản',
  items: [
    { id: 'profile', label: 'Thông tin tài khoản', icon: 'person-outline' },
    { id: 'payment', label: 'Phương thức thanh toán', icon: 'card-outline' },
    { id: 'logout', label: 'Đăng xuất', icon: 'log-out-outline', isDestructive: true },
  ],
};