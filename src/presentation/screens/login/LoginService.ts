import { LoginProvider, LoginValidationState } from './LoginEnums';
import { LoginFormState } from './LoginInterfaces';
import { LOGIN_PHONE_CONFIG } from './LoginConstants';

export class LoginUIService {
  /**
   * Validate phone number format
   */
  static validatePhoneNumber(phone: string): boolean {
    return LOGIN_PHONE_CONFIG.PHONE_REGEX.test(phone);
  }

  /**
   * Format phone input (remove non-digits)
   */
  static formatPhoneInput(input: string): string {
    return input.replace(/\D/g, '');
  }

  /**
   * Get validation state based on phone input
   */
  static getValidationState(phone: string): LoginValidationState {
    if (phone.length === 0) {
      return LoginValidationState.IDLE;
    }
    return this.validatePhoneNumber(phone) ? LoginValidationState.VALID : LoginValidationState.INVALID;
  }

  /**
   * Format phone for display with country code
   */
  static formatPhoneDisplay(phone: string): string {
    return `${LOGIN_PHONE_CONFIG.COUNTRY_CODE}${phone}`;
  }

  /**
   * Generate user ID from timestamp
   */
  static generateUserId(): string {
    return `user_${Date.now()}`;
  }

  /**
   * Check if form is submittable
   */
  static canSubmitForm(state: LoginFormState): boolean {
    return state.validationState === LoginValidationState.VALID;
  }

  /**
   * Handle social login provider selection
   */
  static handleSocialLogin(provider: LoginProvider): void {
    // Placeholder for future social auth implementation
    console.log(`Social login initiated: ${provider}`);
  }
}