import { Product } from '../../../data/mockProducts';
import { SearchFilterMode } from './SearchEnums';

export interface SearchState {
  query: string;
  filteredProducts: Product[];
  filterMode: SearchFilterMode;
  categoryId?: string;
};

export interface SearchHeaderProps {
  query: string;
  onQueryChange: (text: string) => void;
  onCancel: () => void;
};

export interface SearchProductItemProps {
  product: Product;
  onAddPress: () => void;
};