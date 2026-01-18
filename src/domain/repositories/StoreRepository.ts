import { Store } from '../entities/Store';

export interface GetStoresParams {
  page?: number;
  limit?: number;
}

export interface StoresResult {
  stores: Store[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetStoresByProductParams {
  productId: number;
  lat: number;
  lng: number;
  page?: number;
  limit?: number;
}

export interface StoresByProductResult {
  stores: Store[];
}

export interface StoreRepository {
  getStores(params?: GetStoresParams): Promise<StoresResult>;
  getStoreById(id: number): Promise<Store>;
  getStoresByProduct(params: GetStoresByProductParams): Promise<StoresByProductResult>;
}