export enum RegisterValidationState {
  IDLE = 'idle',
  VALIDATING = 'validating',
  VALID = 'valid',
  INVALID = 'invalid',
}

export enum RegisterFlowState {
  INPUT = 'input',
  SENDING_OTP = 'sending_otp',
  VERIFYING_OTP = 'verifying_otp',
  SUCCESS = 'success',
  ERROR = 'error',
}