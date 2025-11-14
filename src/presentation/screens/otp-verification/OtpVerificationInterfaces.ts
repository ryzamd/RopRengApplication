import { OtpErrorType, OtpUserType, OtpVerificationStateEnum } from './OtpVerificationEnums';

export interface OtpVerificationState {
  code: string;
  state: OtpVerificationStateEnum;
  timeRemaining: number;
  retryCount: number;
  errorType: OtpErrorType | null;
}

export interface OtpInputState {
  digits: string[];
  activeIndex: number;
}

export interface OtpVerificationResult {
  isValid: boolean;
  userType?: OtpUserType;
  errorType?: OtpErrorType;
}

export interface OtpTimerState {
  minutes: number;
  seconds: number;
  isExpired: boolean;
}