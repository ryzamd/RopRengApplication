/**
 * User Repository Implementation
 * SQLite implementation of user data access
 */

import { database } from '../../core/database/Database';
import { User } from '../../domain/entities/user/User';
import { PhoneNumber } from '../../domain/entities/user/PhoneNumber';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { BaseRepository } from './base/BaseRepository';
import { STORAGE_KEYS } from '../../config/constants';
import * as SecureStore from 'expo-secure-store';

export class UserRepository
  extends BaseRepository<User>
  implements IUserRepository
{
  constructor() {
    super('users');
  }

  /**
   * Find user by phone number
   */
  public async findByPhone(phone: PhoneNumber): Promise<User | null> {
    const row = await database.getFirstAsync<any>(
      'SELECT * FROM users WHERE phone = ?',
      [phone.toValue()]
    );

    if (!row) {
      return null;
    }

    return this.mapToEntity(row);
  }

  /**
   * Find user by email
   */
  public async findByEmail(email: string): Promise<User | null> {
    const row = await database.getFirstAsync<any>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (!row) {
      return null;
    }

    return this.mapToEntity(row);
  }

  /**
   * Get current user
   */
  public async getCurrentUser(): Promise<User | null> {
    const userId = await SecureStore.getItemAsync(STORAGE_KEYS.USER_ID);

    if (!userId) {
      return null;
    }

    return this.findById(userId);
  }

  /**
   * Set current user
   */
  public async setCurrentUser(user: User): Promise<void> {
    await SecureStore.setItemAsync(STORAGE_KEYS.USER_ID, user.id);
  }

  /**
   * Clear current user
   */
  public async clearCurrentUser(): Promise<void> {
    await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_ID);
  }

  /**
   * Map database row to User entity
   */
  protected mapToEntity(row: any): User {
    return User.fromDatabase({
      id: row.id,
      phone: PhoneNumber.create(row.phone),
      name: row.name,
      email: row.email,
      avatarUrl: row.avatar_url,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      syncedAt: row.synced_at,
    });
  }

  /**
   * Map User entity to database row
   */
  protected mapFromEntity(user: User): any {
    const props = user.toObject();

    return {
      id: props.id,
      phone: props.phone.toValue(),
      name: props.name,
      email: props.email,
      avatar_url: props.avatarUrl,
      created_at: props.createdAt,
      updated_at: props.updatedAt,
      synced_at: props.syncedAt,
      is_synced: props.syncedAt ? 1 : 0,
    };
  }
}
