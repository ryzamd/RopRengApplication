/**
 * Store Location Value Object
 * Encapsulates geographic location
 */

import { ValueObject } from '../base/ValueObject';

export interface Location {
  latitude: number;
  longitude: number;
}

export class StoreLocation extends ValueObject<Location> {
  private readonly latitude: number;
  private readonly longitude: number;

  private constructor(latitude: number, longitude: number) {
    super();
    this.latitude = latitude;
    this.longitude = longitude;
  }

  /**
   * Create store location
   */
  public static create(latitude: number, longitude: number): StoreLocation {
    if (!this.isValidLatitude(latitude)) {
      throw new Error('Invalid latitude');
    }

    if (!this.isValidLongitude(longitude)) {
      throw new Error('Invalid longitude');
    }

    return new StoreLocation(latitude, longitude);
  }

  /**
   * Validate latitude
   */
  private static isValidLatitude(lat: number): boolean {
    return lat >= -90 && lat <= 90;
  }

  /**
   * Validate longitude
   */
  private static isValidLongitude(lng: number): boolean {
    return lng >= -180 && lng <= 180;
  }

  /**
   * Calculate distance to another location (in km)
   * Using Haversine formula
   */
  public distanceTo(other: StoreLocation): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRadians(other.latitude - this.latitude);
    const dLon = this.toRadians(other.longitude - this.longitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(this.latitude)) *
        Math.cos(this.toRadians(other.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Convert degrees to radians
   */
  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Get value
   */
  public toValue(): Location {
    return {
      latitude: this.latitude,
      longitude: this.longitude,
    };
  }

  /**
   * Equality check
   */
  public equals(vo?: ValueObject<Location>): boolean {
    if (!vo || !(vo instanceof StoreLocation)) {
      return false;
    }

    return (
      this.latitude === vo.latitude && this.longitude === vo.longitude
    );
  }
}
