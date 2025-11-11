import { LoginProvider, LoginValidationState } from './LoginEnums';

export interface LoginFormState {
  phoneNumber: string;
  validationState: LoginValidationState;
}

export interface LoginCallbacks {
  onLoginSuccess: (provider: LoginProvider, identifier: string) => void;
  onLoginCancel: () => void;
}

export interface PhoneInputState {
  value: string;
  isFocused: boolean;
  isValid: boolean;
}

export interface SocialLoginConfig {
  provider: LoginProvider;
  label: string;
  iconComponent: string;
}