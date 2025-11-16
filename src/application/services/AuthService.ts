/**
 * Auth Service
 * Business logic for authentication operations
 */

import { PhoneNumber } from '../../domain/entities/user/PhoneNumber';

export class AuthService {
  /**
   * Validate phone number format
   */
  public static validatePhoneNumber(phone: string): {
    isValid: boolean;
    error?: string;
  } {
    try {
      PhoneNumber.create(phone);
      return { isValid: true };
    } catch (error: any) {
      return {
        isValid: false,
        error: error.message || 'Số điện thoại không hợp lệ',
      };
    }
  }

  /**
   * Validate OTP format
   */
  public static validateOTP(otp: string): {
    isValid: boolean;
    error?: string;
  } {
    if (!otp || otp.length === 0) {
      return {
        isValid: false,
        error: 'Vui lòng nhập mã OTP',
      };
    }

    if (otp.length !== 6) {
      return {
        isValid: false,
        error: 'Mã OTP phải có 6 chữ số',
      };
    }

    if (!/^\d+$/.test(otp)) {
      return {
        isValid: false,
        error: 'Mã OTP chỉ được chứa chữ số',
      };
    }

    return { isValid: true };
  }

  /**
   * Format phone number for display
   */
  public static formatPhoneNumber(phone: string): string {
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '');

    // Format as: 0XXX XXX XXX
    if (cleaned.length === 10) {
      return `${cleaned.substring(0, 4)} ${cleaned.substring(4, 7)} ${cleaned.substring(7)}`;
    }

    return phone;
  }

  /**
   * Check if OTP has expired
   */
  public static isOTPExpired(expiresAt: number): boolean {
    return Date.now() >= expiresAt;
  }

  /**
   * Calculate remaining OTP time in seconds
   */
  public static getRemainingOTPTime(expiresAt: number): number {
    const remaining = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
    return remaining;
  }

  /**
   * Format OTP countdown
   */
  public static formatOTPCountdown(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Mask phone number for privacy
   */
  public static maskPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');

    if (cleaned.length === 10) {
      return `${cleaned.substring(0, 3)}****${cleaned.substring(7)}`;
    }

    return phone;
  }
}
