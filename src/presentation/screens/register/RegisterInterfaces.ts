import { RegisterFlowState, RegisterValidationState } from './RegisterEnums';

export interface RegisterFormState {
  phoneNumber: string;
  validationState: RegisterValidationState;
  flowState: RegisterFlowState;
}

export interface RegisterCallbacks {
  onRegisterSuccess: (phone: string) => void;
  onRegisterCancel: () => void;
}

export interface PhoneInputState {
  value: string;
  isFocused: boolean;
  isValid: boolean;
}

export interface RegisterOtpData {
  phone: string;
  otp: string;
}