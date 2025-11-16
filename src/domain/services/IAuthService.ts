/**
 * Auth Service Interface
 * Domain service for authentication logic
 */

import { User } from '../entities/user/User';
import { PhoneNumber } from '../entities/user/PhoneNumber';

export interface IAuthService {
  /**
   * Request OTP for phone number
   */
  requestOTP(phone: PhoneNumber): Promise<void>;

  /**
   * Verify OTP code
   */
  verifyOTP(phone: PhoneNumber, code: string): Promise<{
    user: User;
    token: string;
    refreshToken: string;
  }>;

  /**
   * Logout
   */
  logout(): Promise<void>;

  /**
   * Refresh access token
   */
  refreshToken(refreshToken: string): Promise<string>;

  /**
   * Get current user
   */
  getCurrentUser(): Promise<User | null>;
}
