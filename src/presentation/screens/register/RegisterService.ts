import { REGISTER_PHONE_CONFIG } from './RegisterConstants';
import { RegisterValidationState } from './RegisterEnums';
import { RegisterFormState } from './RegisterInterfaces';

export class RegisterUIService {
  
  static validatePhoneNumber(phone: string): boolean {
    return REGISTER_PHONE_CONFIG.PHONE_REGEX.test(phone);
  }

  static formatPhoneInput(input: string): string {
    return input.replace(/\D/g, '');
  }

  static getValidationState(phone: string): RegisterValidationState {
    if (phone.length === 0) {
      return RegisterValidationState.IDLE;
    }
    return this.validatePhoneNumber(phone)
      ? RegisterValidationState.VALID
      : RegisterValidationState.INVALID;
  }

  static formatPhoneDisplay(phone: string): string {
    return `${REGISTER_PHONE_CONFIG.COUNTRY_CODE}${phone}`;
  }

  static canSubmitForm(state: RegisterFormState): boolean {
    return state.validationState === RegisterValidationState.VALID;
  }

  static isPhoneExistedError(errorMessage: string): boolean {
    const lowerMessage = errorMessage.toLowerCase();
    return (
      lowerMessage.includes('phone number already registered') ||
      lowerMessage.includes('số điện thoại đã được đăng ký') ||
      lowerMessage.includes('already registered')
    );
  }
}