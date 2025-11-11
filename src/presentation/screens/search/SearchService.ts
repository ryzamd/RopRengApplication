import { Product } from '../../../data/mockProducts';
import { SearchFilterMode } from './SearchEnums';

export class SearchUIService {
  /**
   * Filter products by search query
   */
  static filterByQuery(products: Product[], query: string): Product[] {
    if (query.trim() === '') {
      return products;
    }

    const lowerQuery = query.toLowerCase();
    return products.filter((product) =>
      product.name.toLowerCase().includes(lowerQuery)
    );
  };

  /**
   * Filter products by category
   */
  static filterByCategory(products: Product[], categoryId: string): Product[] {
    return products.filter((product) => product.categoryId === categoryId);
  };

  /**
   * Combined filter (category + query)
   */
  static applyFilters(
    products: Product[],
    mode: SearchFilterMode,
    query: string,
    categoryId?: string
  ): Product[] {
    let filtered = products;

    // Apply category filter first
    if (mode === SearchFilterMode.CATEGORY && categoryId) {
      filtered = this.filterByCategory(filtered, categoryId);
    }

    // Apply search query
    filtered = this.filterByQuery(filtered, query);

    return filtered;
  };

  /*
   * Debounce helper for search input
   */
  static createDebounce<T extends (...args: any[]) => void>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    return (...args: Parameters<T>) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };
};