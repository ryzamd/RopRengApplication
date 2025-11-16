/**
 * Store API
 * API endpoints for store-related operations
 */

import { apiClient } from '../ApiClient';
import {
  StoreDTO,
  GetStoresRequest,
  GetStoresResponse,
  GetNearbyStoresRequest,
  GetNearbyStoresResponse,
} from '../dto';

export class StoreApi {
  private static readonly BASE_PATH = '/stores';

  /**
   * Get all stores
   */
  public static async getStores(
    request?: GetStoresRequest
  ): Promise<GetStoresResponse> {
    const response = await apiClient.get<GetStoresResponse>(this.BASE_PATH, {
      params: request,
    });
    return response.data;
  }

  /**
   * Get store by ID
   */
  public static async getStoreById(storeId: string): Promise<StoreDTO> {
    const response = await apiClient.get<StoreDTO>(
      `${this.BASE_PATH}/${storeId}`
    );
    return response.data;
  }

  /**
   * Get active stores
   */
  public static async getActiveStores(): Promise<GetStoresResponse> {
    const response = await apiClient.get<GetStoresResponse>(
      `${this.BASE_PATH}/active`
    );
    return response.data;
  }

  /**
   * Get nearby stores
   */
  public static async getNearbyStores(
    request: GetNearbyStoresRequest
  ): Promise<GetNearbyStoresResponse> {
    const response = await apiClient.get<GetNearbyStoresResponse>(
      `${this.BASE_PATH}/nearby`,
      {
        params: request,
      }
    );
    return response.data;
  }

  /**
   * Search stores by name or address
   */
  public static async searchStores(query: string): Promise<GetStoresResponse> {
    const response = await apiClient.get<GetStoresResponse>(
      `${this.BASE_PATH}/search`,
      {
        params: { q: query },
      }
    );
    return response.data;
  }

  /**
   * Check if store is open
   */
  public static async checkStoreOpen(storeId: string): Promise<boolean> {
    const response = await apiClient.get<{ isOpen: boolean }>(
      `${this.BASE_PATH}/${storeId}/is-open`
    );
    return response.data.isOpen;
  }
}
