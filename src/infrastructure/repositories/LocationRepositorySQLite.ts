import { DeliveryAddress } from '../../domain/entities/DeliveryAddress';
import { LocationRepository } from '../../domain/repositories/LocationRepository';
import * as SQLite from 'expo-sqlite';

export class LocationRepositorySQLite implements LocationRepository {
  private db: SQLite.SQLiteDatabase;

  constructor(db: SQLite.SQLiteDatabase) {
    this.db = db;
  }

  async saveDefaultAddress(address: DeliveryAddress): Promise<void> {
    await this.db.runAsync(
      'UPDATE delivery_addresses SET is_default = 0'
    );
    
    await this.db.runAsync(
      `INSERT OR REPLACE INTO delivery_addresses
       (id, latitude, longitude, formatted_address, is_default, label)
       VALUES (?, ?, ?, ?, 1, ?)`,
      [address.id, address.latitude, address.longitude, address.formattedAddress, address.label ?? null]
    );
  }

  async getDefaultAddress(): Promise<DeliveryAddress | null> {
    const result = await this.db.getFirstAsync<any>(
      'SELECT * FROM delivery_addresses WHERE is_default = 1'
    );

    if (!result) return null;

    return new DeliveryAddress(
      result.id,
      result.latitude,
      result.longitude,
      result.formatted_address,
      true,
      result.label
    );
  }

  async saveAddress(address: DeliveryAddress): Promise<void> {
    await this.db.runAsync(
      `INSERT OR REPLACE INTO delivery_addresses
       (id, latitude, longitude, formatted_address, is_default, label)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        address.id,
        address.latitude,
        address.longitude,
        address.formattedAddress,
        address.isDefault ? 1 : 0,
        address.label ?? null
      ]
    );
  }

  async getAllAddresses(): Promise<DeliveryAddress[]> {
    const results = await this.db.getAllAsync<any>(
      'SELECT * FROM delivery_addresses ORDER BY is_default DESC, id DESC'
    );

    return results.map(
      (row) =>
        new DeliveryAddress(
          row.id,
          row.latitude,
          row.longitude,
          row.formatted_address,
          row.is_default === 1,
          row.label
        )
    );
  }

  async deleteAddress(id: string): Promise<void> {
    await this.db.runAsync('DELETE FROM delivery_addresses WHERE id = ?', [id]);
  }
}