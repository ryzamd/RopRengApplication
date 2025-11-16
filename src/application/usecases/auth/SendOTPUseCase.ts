/**
 * Send OTP Use Case
 * Sends OTP to user's phone number for authentication
 */

import { PhoneNumber } from '../../../domain/entities/user/PhoneNumber';
import { UserApi } from '../../../infrastructure/api/endpoints/UserApi';
import { MockApiService } from '../../../infrastructure/mock/MockApiService';
import { ENV } from '../../../config/env';
import { Logger } from '../../../core/utils/Logger';

export interface SendOTPInput {
  phone: string;
}

export interface SendOTPOutput {
  success: boolean;
  message: string;
  expiresAt: number;
}

export class SendOTPUseCase {
  public async execute(input: SendOTPInput): Promise<SendOTPOutput> {
    try {
      // Validate phone number
      const phoneNumber = PhoneNumber.create(input.phone);

      Logger.info('Sending OTP', { phone: phoneNumber.toValue() });

      // Use mock or real API based on environment
      const result = ENV.USE_MOCK_DATA
        ? await MockApiService.sendOTP({ phone: phoneNumber.toValue() })
        : await UserApi.sendOTP({ phone: phoneNumber.toValue() });

      Logger.info('OTP sent successfully', {
        phone: phoneNumber.toValue(),
        expiresAt: result.expiresAt,
      });

      return result;
    } catch (error: any) {
      Logger.error('Send OTP failed', error);
      throw new Error(error.message || 'Không thể gửi OTP. Vui lòng thử lại.');
    }
  }
}
