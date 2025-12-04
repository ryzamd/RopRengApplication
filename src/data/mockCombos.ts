import { ComboType } from '../presentation/screens/home/HomeEnums';
import { Combo } from '../presentation/screens/home/HomeInterfaces';
import { MOCK_PRODUCTS } from './mockProducts';

// Helper: create expiry time
const createExpiry = (hours: number) => {
  const now = new Date();
  now.setHours(now.getHours() + hours);
  return now;
};

export const MOCK_COMBOS: Combo[] = [
  {
    id: 'combo-daily-1',
    title: 'Combo 2 Ly Chỉ 79K + Freeship',
    type: ComboType.DAILY,
    products: [
      { ...MOCK_PRODUCTS[20], discountAmount: 0, discount: undefined, imageUrl: 'https://via.placeholder.com/200x200/FFB6C1/000?text=Tra+Sen+Tuyet' }, // Matcha Latte
      { ...MOCK_PRODUCTS[21], discountAmount: 0, discount: undefined }, // Matcha Đá Xay
      { ...MOCK_PRODUCTS[22], discountAmount: 0, discount: undefined }, // Matcha Nóng
    ],
    expiresAt: createExpiry(9),
  },
  {
    id: 'combo-hourly-1',
    title: 'Ưu Đãi Giới Hạn - Đồng Giá 39K',
    type: ComboType.HOURLY,
    products: [
      { ...MOCK_PRODUCTS[35], discountAmount: 20000 }, // Ethiopia Americano
      { ...MOCK_PRODUCTS[36], discountAmount: 20000 }, // Ethiopia Americano Nóng
      { ...MOCK_PRODUCTS[10], discountAmount: 15000, discount: undefined }, // Espresso Đơn
    ],
    expiresAt: createExpiry(1),
  },
];