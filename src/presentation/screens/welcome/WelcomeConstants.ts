import { IoniconsName } from '../../../infrastructure/icons';
import { PROMO_ICONS, QUICK_ACTION_ICONS } from '../../theme/iconConstants';

export const WELCOME_TEXT = {
  HEADER: {
    GREETING: 'Chào bạn mới 👋',
  },
  LOGIN_CARD: {
    TITLE: 'Đăng nhập',
    SUBTITLE: 'Sử dụng app để tích điểm và đổi những ưu đãi chỉ dành riêng cho thành viên bạn nhé!',
    BUTTON_TEXT: 'Đăng nhập',
    LOYALTY_TITLE: 'Rốp Rẻng Loyalty',
  },
  BRAND_SECTION: {
    TITLE: 'Lựa chọn thương hiệu',
    BRANDS: [
      { id: 'ropreng', name: 'Rốp Rẻng' },
      { id: 'ropreng1', name: 'Rốp Rẻng 1' },
      { id: 'ropreng2', name: 'Rốp Rẻng 2' },
    ],
  },
  QUICK_ACTIONS: [
    { id: 'delivery', label: 'Giao hàng', icon: QUICK_ACTION_ICONS.DELIVERY },
    { id: 'takeaway', label: 'Mang đi', icon: QUICK_ACTION_ICONS.TAKEAWAY },
    { id: 'dine-in', label: 'Tại chỗ', icon: QUICK_ACTION_ICONS.DINE_IN },
    { id: 'beans', label: 'Đổi Bean', icon: QUICK_ACTION_ICONS.BEANS },
  ] as { id: string; label: string; icon: IoniconsName }[],
  PROMOS: [
    {
      id: '1',
      title: 'Càng đông càng vui',
      subtitle: 'ĐƠN LỚN TỪ 10 LY\nGiảm ngay 20% cho đơn hàng',
      backgroundColor: '#87CEEB',
      icon: PROMO_ICONS.CELEBRATION,
    },
    {
      id: '2',
      title: 'Ưu đãi buổi sáng',
      subtitle: 'Mua 1 tặng 1\nÁp dụng từ 6h-9h sáng',
      backgroundColor: '#FFE4B5',
      icon: PROMO_ICONS.SUNNY,
    },
    {
      id: '3',
      title: 'Tích điểm đổi quà',
      subtitle: 'Đến nhận và dùng tại\nBạn sẽ đến quầy nhận sản phẩm',
      backgroundColor: '#98FB98',
      icon: PROMO_ICONS.GIFT,
    },
  ] as { id: string; title: string; subtitle: string; backgroundColor: string; icon: IoniconsName }[],
} as const;