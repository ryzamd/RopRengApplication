import { Product } from '../../../data/mockProducts';
import { CollectionStatus, ComboType } from './HomeEnums';

export interface ComboProduct extends Product {
  discountAmount?: number; // For discount badge (e.g., 20000 → "-20,000đ")
}

export interface Combo {
  id: string;
  title: string;
  type: ComboType;
  products: ComboProduct[]; // Use extended interface
  expiresAt: Date;
}

export interface Collection {
  id: string;
  title: string;
  description: string;
  bannerImage: string;
  items: Product[];
  promoCode?: string;
  purchaseConditions?: string;
  status: CollectionStatus;
}

export interface AuthenticatedUserInfo {
  name: string;
  voucherCount: number;
  notificationCount: number;
}