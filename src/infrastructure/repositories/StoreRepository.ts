/**
 * Store Repository Implementation
 * SQLite implementation of store data access
 */

import { database } from '../../core/database/Database';
import { Store } from '../../domain/entities/store/Store';
import { StoreLocation } from '../../domain/entities/store/StoreLocation';
import { IStoreRepository } from '../../domain/repositories/IStoreRepository';
import { BaseRepository } from './base/BaseRepository';

export class StoreRepository
  extends BaseRepository<Store>
  implements IStoreRepository
{
  constructor() {
    super('stores');
  }

  /**
   * Find active stores
   */
  public async findActive(): Promise<Store[]> {
    const rows = await database.getAllAsync<any>(
      'SELECT * FROM stores WHERE is_active = 1 ORDER BY name ASC'
    );

    return rows.map((row) => this.mapToEntity(row));
  }

  /**
   * Find nearby stores using Haversine formula
   * SQLite implementation with distance calculation
   */
  public async findNearby(
    location: StoreLocation,
    radiusKm: number
  ): Promise<Store[]> {
    const userLoc = location.toValue();

    // Fetch all active stores first
    const rows = await database.getAllAsync<any>(
      'SELECT * FROM stores WHERE is_active = 1'
    );

    // Calculate distance in-memory and filter
    const storesWithDistance = rows
      .map((row) => {
        const storeLoc = StoreLocation.create(row.latitude, row.longitude);
        const distance = location.distanceTo(storeLoc);

        return {
          row,
          distance,
        };
      })
      .filter((item) => item.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);

    return storesWithDistance.map((item) => this.mapToEntity(item.row));
  }

  /**
   * Find store by name
   */
  public async findByName(name: string): Promise<Store | null> {
    const row = await database.getFirstAsync<any>(
      'SELECT * FROM stores WHERE name = ? AND is_active = 1',
      [name]
    );

    if (!row) {
      return null;
    }

    return this.mapToEntity(row);
  }

  /**
   * Search stores by name (partial match)
   */
  public async search(query: string): Promise<Store[]> {
    const rows = await database.getAllAsync<any>(
      `SELECT * FROM stores
       WHERE (name LIKE ? OR address LIKE ?)
       AND is_active = 1
       ORDER BY name ASC
       LIMIT 20`,
      [`%${query}%`, `%${query}%`]
    );

    return rows.map((row) => this.mapToEntity(row));
  }

  /**
   * Find stores by city/region
   */
  public async findByRegion(region: string): Promise<Store[]> {
    const rows = await database.getAllAsync<any>(
      `SELECT * FROM stores
       WHERE address LIKE ?
       AND is_active = 1
       ORDER BY name ASC`,
      [`%${region}%`]
    );

    return rows.map((row) => this.mapToEntity(row));
  }

  /**
   * Get store operating hours
   * This is a helper method for checking if store is currently open
   */
  public async isStoreOpen(storeId: string): Promise<boolean> {
    const store = await this.findById(storeId);

    if (!store) {
      return false;
    }

    // Assuming store has operating hours in the format
    // { openTime: "08:00", closeTime: "22:00" }
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;

    const props = store.toObject();

    if (!props.operatingHours) {
      return true; // If no hours specified, assume always open
    }

    const [openHour, openMinute] = props.operatingHours.openTime
      .split(':')
      .map(Number);
    const [closeHour, closeMinute] = props.operatingHours.closeTime
      .split(':')
      .map(Number);

    const openTime = openHour * 60 + openMinute;
    const closeTime = closeHour * 60 + closeMinute;

    return currentTime >= openTime && currentTime <= closeTime;
  }

  /**
   * Map database row to Store entity
   */
  protected mapToEntity(row: any): Store {
    return Store.fromDatabase({
      id: row.id,
      name: row.name,
      address: row.address,
      location: StoreLocation.create(row.latitude, row.longitude),
      phone: row.phone,
      isActive: row.is_active === 1,
      operatingHours: row.operating_hours
        ? JSON.parse(row.operating_hours)
        : undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      syncedAt: row.synced_at,
    });
  }

  /**
   * Map Store entity to database row
   */
  protected mapFromEntity(store: Store): any {
    const props = store.toObject();
    const locationValue = props.location.toValue();

    return {
      id: props.id,
      name: props.name,
      address: props.address,
      latitude: locationValue.latitude,
      longitude: locationValue.longitude,
      phone: props.phone,
      is_active: props.isActive ? 1 : 0,
      operating_hours: props.operatingHours
        ? JSON.stringify(props.operatingHours)
        : null,
      created_at: props.createdAt,
      updated_at: props.updatedAt,
      synced_at: props.syncedAt,
      is_synced: props.syncedAt ? 1 : 0,
    };
  }
}
