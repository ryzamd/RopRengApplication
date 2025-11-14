export const OTP_TEXT = {
  TITLE: 'Xác nhận Mã OTP',
  SUBTITLE_PREFIX: 'Mã xác thực gồm 6 số đã được gửi đến Zalo hoặc số điện thoại',
  INPUT_LABEL: 'Nhập mã để tiếp tục',
  RESEND_PROMPT: 'Bạn không nhận được mã?',
  RESEND_BUTTON: 'Gửi lại',
  ERROR_INVALID: 'Mã OTP không chính xác',
  ERROR_EXPIRED: 'OTP code đã hết hạn sử dụng',
  ERROR_MAX_RETRIES: 'Bạn đã gửi quá nhiều lần, vui lòng thực hiện lại sau',
  RETRY_BUTTON: 'Gửi lại mã',
  BUTTON_OK: 'OK',
  CLOSE_BUTTON: '✕',
};

export const OTP_CONFIG = {
  CODE_LENGTH: 6,
  VALID_CODE_EXISTING_USER: '111111',
  VALID_CODE_NEW_USER: '111112',
  TIMER_DURATION_SECONDS: 180,
  MAX_RETRY_COUNT: 3,
  SENDING_DURATION_MS: 2000,
};