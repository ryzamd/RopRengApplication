/**
 * User API
 * API endpoints for user-related operations
 */

import { apiClient } from '../ApiClient';
import {
  SendOTPRequest,
  SendOTPResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  UserDTO,
} from '../dto';

export class UserApi {
  private static readonly BASE_PATH = '/users';

  /**
   * Send OTP to phone number
   */
  public static async sendOTP(
    request: SendOTPRequest
  ): Promise<SendOTPResponse> {
    const response = await apiClient.post<SendOTPResponse>(
      `${this.BASE_PATH}/send-otp`,
      request
    );
    return response.data;
  }

  /**
   * Verify OTP and authenticate
   */
  public static async verifyOTP(
    request: VerifyOTPRequest
  ): Promise<VerifyOTPResponse> {
    const response = await apiClient.post<VerifyOTPResponse>(
      `${this.BASE_PATH}/verify-otp`,
      request
    );
    return response.data;
  }

  /**
   * Get current user profile
   */
  public static async getCurrentUser(): Promise<UserDTO> {
    const response = await apiClient.get<UserDTO>(`${this.BASE_PATH}/me`);
    return response.data;
  }

  /**
   * Update user profile
   */
  public static async updateProfile(
    request: UpdateUserRequest
  ): Promise<UpdateUserResponse> {
    const response = await apiClient.patch<UpdateUserResponse>(
      `${this.BASE_PATH}/me`,
      request
    );
    return response.data;
  }

  /**
   * Get user by ID
   */
  public static async getUserById(userId: string): Promise<UserDTO> {
    const response = await apiClient.get<UserDTO>(
      `${this.BASE_PATH}/${userId}`
    );
    return response.data;
  }

  /**
   * Delete user account
   */
  public static async deleteAccount(): Promise<void> {
    await apiClient.delete(`${this.BASE_PATH}/me`);
  }
}
