import { SecureStorage } from './secureStorage';

/**
 * TokenStorage - Wrapper for auth token operations
 * Future: Add token refresh logic here
 */
export class TokenStorage {
  static async saveTokens(accessToken: string, refreshToken: string, userId: string): Promise<void> {
    await Promise.all([
      SecureStorage.saveAuthToken(accessToken),
      SecureStorage.saveRefreshToken(refreshToken),
      SecureStorage.saveUserId(userId),
    ]);
  }

  static async getTokens(): Promise<{ accessToken: string | null; refreshToken: string | null;  userId: string | null; }> {
    const [accessToken, refreshToken, userId] = await Promise.all([
      SecureStorage.getAuthToken(),
      SecureStorage.getRefreshToken(),
      SecureStorage.getUserId(),
    ]);

    return { accessToken, refreshToken, userId };
  }

  static async clearTokens(): Promise<void> {
    await SecureStorage.clearAll();
  }
}