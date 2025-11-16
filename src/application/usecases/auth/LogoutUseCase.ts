/**
 * Logout Use Case
 * Logs out the current user and clears session
 */

import { UserRepository } from '../../../infrastructure/repositories/UserRepository';
import { clearAuthToken } from '../../../infrastructure/api/interceptors/AuthInterceptor';
import { Logger } from '../../../core/utils/Logger';
import { EventBus } from '../../../core/events/EventBus';
import { EventType } from '../../../core/events/DomainEvents';

export class LogoutUseCase {
  constructor(private userRepository: UserRepository) {}

  public async execute(): Promise<void> {
    try {
      // Get current user before logout
      const currentUser = await this.userRepository.getCurrentUser();

      Logger.info('Logging out user', {
        userId: currentUser?.id,
      });

      // Clear auth token
      await clearAuthToken();

      // Clear current user
      await this.userRepository.clearCurrentUser();

      // Emit logout event
      if (currentUser) {
        await EventBus.getInstance().emit(EventType.USER_LOGGED_OUT, {
          userId: currentUser.id,
          timestamp: Date.now(),
        });
      }

      Logger.info('User logged out successfully');
    } catch (error: any) {
      Logger.error('Logout failed', error);
      throw new Error(
        error.message || 'Đăng xuất thất bại. Vui lòng thử lại.'
      );
    }
  }
}
