/**
 * Verify OTP Use Case
 * Verifies OTP and authenticates user
 */

import { PhoneNumber } from '../../../domain/entities/user/PhoneNumber';
import { User } from '../../../domain/entities/user/User';
import { UserRepository } from '../../../infrastructure/repositories/UserRepository';
import { UserApi } from '../../../infrastructure/api/endpoints/UserApi';
import { MockApiService } from '../../../infrastructure/mock/MockApiService';
import { saveAuthToken } from '../../../infrastructure/api/interceptors/AuthInterceptor';
import { ENV } from '../../../config/env';
import { Logger } from '../../../core/utils/Logger';
import { EventBus } from '../../../core/events/EventBus';
import { EventType } from '../../../core/events/DomainEvents';

export interface VerifyOTPInput {
  phone: string;
  otp: string;
}

export interface VerifyOTPOutput {
  success: boolean;
  user: User;
  token: string;
}

export class VerifyOTPUseCase {
  constructor(private userRepository: UserRepository) {}

  public async execute(input: VerifyOTPInput): Promise<VerifyOTPOutput> {
    try {
      // Validate phone number
      const phoneNumber = PhoneNumber.create(input.phone);

      Logger.info('Verifying OTP', { phone: phoneNumber.toValue() });

      // Use mock or real API based on environment
      const result = ENV.USE_MOCK_DATA
        ? await MockApiService.verifyOTP({
            phone: phoneNumber.toValue(),
            otp: input.otp,
          })
        : await UserApi.verifyOTP({
            phone: phoneNumber.toValue(),
            otp: input.otp,
          });

      if (!result.success) {
        throw new Error('Xác thực OTP thất bại');
      }

      // Save auth token
      await saveAuthToken(result.token);

      // Check if user exists in local database
      let user = await this.userRepository.findByPhone(phoneNumber);

      if (!user) {
        // Create new user from API response
        user = User.create(phoneNumber, {
          name: result.user.name,
          email: result.user.email,
          avatarUrl: result.user.avatarUrl,
        });

        // Save to local database
        await this.userRepository.save(user);

        Logger.info('New user created', { userId: user.id });
      } else {
        // Update existing user with latest data
        user.updateProfile({
          name: result.user.name,
          email: result.user.email,
          avatarUrl: result.user.avatarUrl,
        });

        await this.userRepository.save(user);

        Logger.info('Existing user updated', { userId: user.id });
      }

      // Set as current user
      await this.userRepository.setCurrentUser(user);

      // Emit login event
      await EventBus.getInstance().emit(EventType.USER_LOGGED_IN, {
        userId: user.id,
        timestamp: Date.now(),
      });

      Logger.info('OTP verified successfully', { userId: user.id });

      return {
        success: true,
        user,
        token: result.token,
      };
    } catch (error: any) {
      Logger.error('Verify OTP failed', error);
      throw new Error(
        error.message || 'Xác thực OTP thất bại. Vui lòng thử lại.'
      );
    }
  }
}
