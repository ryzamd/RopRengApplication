/**
 * Get Current User Use Case
 * Retrieves the currently authenticated user
 */

import { User } from '../../../domain/entities/user/User';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { Logger } from '../../../core/utils/Logger';

export class GetCurrentUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  public async execute(): Promise<User | null> {
    try {
      const user = await this.userRepository.getCurrentUser();

      if (user) {
        Logger.debug('Current user retrieved', { userId: user.id });
      } else {
        Logger.debug('No current user found');
      }

      return user;
    } catch (error: any) {
      Logger.error('Get current user failed', error);
      return null;
    }
  }
}
