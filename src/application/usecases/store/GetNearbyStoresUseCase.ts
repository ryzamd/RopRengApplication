/**
 * Get Nearby Stores Use Case
 * Retrieves stores near a given location
 */

import { Store } from '../../../domain/entities/store/Store';
import { StoreLocation } from '../../../domain/entities/store/StoreLocation';
import { IStoreRepository } from '../../../domain/repositories/IStoreRepository';
import { StoreApi } from '../../../infrastructure/api/endpoints/StoreApi';
import { MockApiService } from '../../../infrastructure/mock/MockApiService';
import { ENV } from '../../../config/env';
import { Logger } from '../../../core/utils/Logger';

export interface GetNearbyStoresInput {
  latitude: number;
  longitude: number;
  radiusKm: number;
  forceRefresh?: boolean;
}

export interface GetNearbyStoresOutput {
  stores: Store[];
}

export class GetNearbyStoresUseCase {
  constructor(private storeRepository: IStoreRepository) {}

  public async execute(input: GetNearbyStoresInput): Promise<GetNearbyStoresOutput> {
    try {
      Logger.info('Getting nearby stores', input);

      const userLocation = StoreLocation.create(
        input.latitude,
        input.longitude
      );

      // Try to get from local database first (offline-first)
      if (!input.forceRefresh) {
        const localStores = await this.storeRepository.findNearby(
          userLocation,
          input.radiusKm
        );

        if (localStores.length > 0) {
          Logger.info('Stores retrieved from local database', {
            count: localStores.length,
          });

          return { stores: localStores };
        }
      }

      // Fetch from API if local database is empty or force refresh
      const result = ENV.USE_MOCK_DATA
        ? await MockApiService.getNearbyStores({
            latitude: input.latitude,
            longitude: input.longitude,
            radiusKm: input.radiusKm,
          })
        : await StoreApi.getNearbyStores({
            latitude: input.latitude,
            longitude: input.longitude,
            radiusKm: input.radiusKm,
          });

      // Convert DTOs to domain entities
      const stores = result.stores.map((dto) =>
        Store.fromDatabase({
          id: dto.id,
          name: dto.name,
          address: dto.address,
          location: StoreLocation.create(dto.latitude, dto.longitude),
          phone: dto.phone,
          isActive: dto.isActive,
          operatingHours: dto.operatingHours,
          createdAt: dto.createdAt,
          updatedAt: dto.updatedAt,
          syncedAt: Date.now(),
        })
      );

      // Save to local database for offline access
      await Promise.all(
        stores.map((store) => this.storeRepository.save(store))
      );

      Logger.info('Stores retrieved from API and cached', {
        count: stores.length,
      });

      return { stores };
    } catch (error: any) {
      Logger.error('Get nearby stores failed', error);

      // Fallback to local database on error
      const userLocation = StoreLocation.create(
        input.latitude,
        input.longitude
      );
      const localStores = await this.storeRepository.findNearby(
        userLocation,
        input.radiusKm
      );

      if (localStores.length > 0) {
        Logger.warn('Using cached stores due to API error');
        return { stores: localStores };
      }

      throw new Error(
        error.message || 'Không thể tải cửa hàng. Vui lòng thử lại.'
      );
    }
  }
}
