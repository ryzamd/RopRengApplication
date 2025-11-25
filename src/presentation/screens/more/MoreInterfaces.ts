import { IoniconsName } from '../../../infrastructure/icons';

export interface UtilityItemData {
  id: string;
  label: string;
  icon: IoniconsName;
  route?: string; // Dùng để navigate nếu cần
  badge?: number; // Số lượng (ví dụ: số ưu đãi)
}

export interface MenuItemData {
  id: string;
  label: string;
  icon: IoniconsName;
  isDestructive?: boolean; // Cho nút Đăng xuất (màu đỏ)
  action?: () => void; // Hàm xử lý khi bấm
  route?: string;
}

export interface MenuSectionData {
  title?: string;
  items: MenuItemData[];
}