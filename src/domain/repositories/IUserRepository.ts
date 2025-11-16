/**
 * User Repository Interface
 * Contract for user data access
 */

import { IRepository } from './IRepository';
import { User } from '../entities/user/User';
import { PhoneNumber } from '../entities/user/PhoneNumber';

export interface IUserRepository extends IRepository<User> {
  /**
   * Find user by phone number
   */
  findByPhone(phone: PhoneNumber): Promise<User | null>;

  /**
   * Find user by email
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Get current user
   */
  getCurrentUser(): Promise<User | null>;

  /**
   * Set current user
   */
  setCurrentUser(user: User): Promise<void>;

  /**
   * Clear current user
   */
  clearCurrentUser(): Promise<void>;
}
