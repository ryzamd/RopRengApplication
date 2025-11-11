export enum LoginProvider {
  PHONE = 'phone',
  FACEBOOK = 'facebook',
  GOOGLE = 'google',
}

export enum LoginValidationState {
  IDLE = 'idle',
  VALIDATING = 'validating',
  VALID = 'valid',
  INVALID = 'invalid',
}