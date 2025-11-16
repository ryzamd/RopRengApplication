/**
 * Store Repository Interface
 * Contract for store data access
 */

import { IRepository } from './IRepository';
import { Store } from '../entities/store/Store';
import { StoreLocation } from '../entities/store/StoreLocation';

export interface IStoreRepository extends IRepository<Store> {
  /**
   * Find active stores
   */
  findActive(): Promise<Store[]>;

  /**
   * Find nearby stores
   */
  findNearby(location: StoreLocation, radiusKm: number): Promise<Store[]>;

  /**
   * Find store by name
   */
  findByName(name: string): Promise<Store | null>;
}
