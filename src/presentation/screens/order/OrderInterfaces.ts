import { Product } from '../../../data/mockProducts';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderHeaderProps {
  mode: string;
  onModeChange: (mode: string) => void;
  address: string;
}

export interface CategorySidebarProps {
  categories: { id: string; name: string }[];
  selectedCategoryId: string;
  onCategoryPress: (categoryId: string) => void;
}

export interface ProductListProps {
  sections: { categoryId: string; categoryName: string; data: Product[] }[];
  onScroll: (categoryId: string) => void;
  onAddToCart: (product: Product) => void;
  scrollRef: React.RefObject<any>;
}

export interface ProductItemProps {
  product: Product;
  onAdd: () => void;
}