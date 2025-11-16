import { Collection } from '../presentation/screens/home/HomeInterfaces';
import { CollectionStatus } from '../presentation/screens/home/HomeEnums';
import { MOCK_PRODUCTS } from './mockProducts';

export const MOCK_COLLECTIONS: Collection[] = [
  {
    id: 'collection-1',
    title: 'Combo 2 Ly 79K',
    description: 'Freeship cần nữa dành cho homies cùng nhà',
    bannerImage: 'https://via.placeholder.com/400x200/87CEEB/000?text=Combo+2+Ly',
    items: [MOCK_PRODUCTS[0], MOCK_PRODUCTS[1], MOCK_PRODUCTS[2], MOCK_PRODUCTS[3]],
    promoCode: '2LY79',
    purchaseConditions: 'Áp dụng cho đơn hàng từ 2 ly size M trở lên',
    status: CollectionStatus.ACTIVE,
  },
  {
    id: 'collection-2',
    title: 'Giảm 30% + Freeship 0đ',
    description: 'Chỉ áp dụng cho thành viên mới',
    bannerImage: 'https://via.placeholder.com/400x200/FFE4B5/000?text=Giam+30%',
    items: [MOCK_PRODUCTS[4], MOCK_PRODUCTS[5], MOCK_PRODUCTS[6]],
    status: CollectionStatus.ACTIVE,
  },
];