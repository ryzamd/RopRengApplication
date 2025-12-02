import { StoreMenuService } from '../../../data/mockMenuStores';
import { Store } from '../../../data/mockStores';
import { StoresSortMode } from './StoresEnums';

export class StoresUIService {

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

  static getNearestStore(stores: Store[]): Store | null {
    if (stores.length === 0) return null;
    return this.sortStores(stores, StoresSortMode.NEAREST)[0];
  }

  static getOtherStores(stores: Store[]): Store[] {
    const sorted = this.sortStores(stores, StoresSortMode.NEAREST);
    return sorted.slice(1);
  }

  static formatDistance(distanceKm: number): string {
    return distanceKm.toFixed(2);
  }

  static filterStores(stores: Store[], query: string): Store[] {
    if (!query) return stores;

    const lowerQuery = query.toLowerCase();
    return stores.filter(
      (store) =>
        store.name.toLowerCase().includes(lowerQuery) ||
        store.address.toLowerCase().includes(lowerQuery)
    );
  }

  static filterStoresByProduct(stores: Store[], productId: string): Store[] {
    const storeIds = StoreMenuService.getStoresWithProduct(productId);
    return stores.filter((store) => storeIds.includes(store.id));
  }

  static getAvailableStoresForProduct(allStores: Store[], productId: string): Store[] {
    const validStoreIds = StoreMenuService.getStoresWithProduct(productId);
    return allStores.filter(store => validStoreIds.includes(store.id));
  }
}