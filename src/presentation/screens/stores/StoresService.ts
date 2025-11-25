import { Store } from '../../../data/mockStores';
import { StoresSortMode } from './StoresEnums';

export class StoresUIService {
  /**
   * Sort stores by distance or name
   */
  static sortStores(stores: Store[], mode: StoresSortMode): Store[] {
    switch (mode) {
      case StoresSortMode.NEAREST:
        return [...stores].sort((a, b) => a.distanceKm - b.distanceKm);
      case StoresSortMode.ALPHABETICAL:
        return [...stores].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return stores;
    }
  }

  /**
   * Get nearest store (first in sorted list)
   */
  static getNearestStore(stores: Store[]): Store | null {
    if (stores.length === 0) return null;
    return this.sortStores(stores, StoresSortMode.NEAREST)[0];
  }

  /**
   * Get other stores (excluding nearest)
   */
  static getOtherStores(stores: Store[]): Store[] {
    const sorted = this.sortStores(stores, StoresSortMode.NEAREST);
    return sorted.slice(1);
  }

  /**
   * Format distance for display
   */
  static formatDistance(distanceKm: number): string {
    return distanceKm.toFixed(2);
  }

  /**
   * Filter stores by search query
   */
  static filterStores(stores: Store[], query: string): Store[] {
    if (!query.trim()) return stores;
    
    const lowerQuery = query.toLowerCase();
    return stores.filter(
      (store) =>
        store.name.toLowerCase().includes(lowerQuery) ||
        store.address.toLowerCase().includes(lowerQuery)
    );
  }
}