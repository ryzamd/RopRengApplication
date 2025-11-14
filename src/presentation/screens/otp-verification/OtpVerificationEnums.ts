export enum OtpVerificationStateEnum {
  IDLE = 'idle',
  VERIFYING = 'verifying',
  SUCCESS = 'success',
  ERROR = 'error',
  EXPIRED = 'expired',
}

export enum OtpUserType {
  EXISTING = 'existing',
  NEW = 'new',
}

export enum OtpErrorType {
  INVALID_CODE = 'invalid_code',
  EXPIRED = 'expired',
  MAX_RETRIES = 'max_retries',
}