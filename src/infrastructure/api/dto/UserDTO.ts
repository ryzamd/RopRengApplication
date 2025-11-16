/**
 * User Data Transfer Objects
 * DTOs for user-related API requests/responses
 */

/**
 * User response from API
 */
export interface UserDTO {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
  createdAt: number;
  updatedAt: number;
}

/**
 * Send OTP request
 */
export interface SendOTPRequest {
  phone: string;
  recaptchaToken?: string;
}

/**
 * Send OTP response
 */
export interface SendOTPResponse {
  success: boolean;
  message: string;
  expiresAt: number;
}

/**
 * Verify OTP request
 */
export interface VerifyOTPRequest {
  phone: string;
  otp: string;
}

/**
 * Verify OTP response
 */
export interface VerifyOTPResponse {
  success: boolean;
  token: string;
  user: UserDTO;
}

/**
 * Update user profile request
 */
export interface UpdateUserRequest {
  name?: string;
  email?: string;
  avatarUrl?: string;
}

/**
 * Update user profile response
 */
export interface UpdateUserResponse {
  user: UserDTO;
}
