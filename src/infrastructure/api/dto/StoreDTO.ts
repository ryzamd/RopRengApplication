/**
 * Store Data Transfer Objects
 * DTOs for store-related API requests/responses
 */

/**
 * Operating hours
 */
export interface OperatingHoursDTO {
  openTime: string; // e.g., "08:00"
  closeTime: string; // e.g., "22:00"
}

/**
 * Store response from API
 */
export interface StoreDTO {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  isActive: boolean;
  operatingHours?: OperatingHoursDTO;
  createdAt: number;
  updatedAt: number;
}

/**
 * Get stores request
 */
export interface GetStoresRequest {
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  activeOnly?: boolean;
}

/**
 * Get stores response
 */
export interface GetStoresResponse {
  stores: StoreDTO[];
}

/**
 * Get nearby stores request
 */
export interface GetNearbyStoresRequest {
  latitude: number;
  longitude: number;
  radiusKm: number;
}

/**
 * Get nearby stores response
 */
export interface GetNearbyStoresResponse {
  stores: Array<StoreDTO & { distance: number }>;
}
