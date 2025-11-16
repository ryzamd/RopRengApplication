/**
 * Environment Configuration
 * Centralized configuration for the entire application
 */

export const ENV = {
  // Environment
  isDevelopment: __DEV__,
  isProduction: !__DEV__,

  // Feature flags
  USE_MOCK_DATA: __DEV__, // Auto use mock data in development
  ENABLE_OFFLINE_SYNC: true,
  ENABLE_LOGGING: __DEV__,
  ENABLE_PERFORMANCE_MONITORING: true,

  // API Configuration
  API_URL: __DEV__
    ? 'http://localhost:3000/api'
    : 'https://api.ropreng.com',
  API_TIMEOUT: 30000, // 30 seconds

  // VNPay Configuration
  VNPAY_URL: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  VNPAY_TMN_CODE: 'YOUR_TMN_CODE',
  VNPAY_HASH_SECRET: 'YOUR_HASH_SECRET',
  VNPAY_RETURN_URL: 'ropreng://payment-return',

  // App Configuration
  APP_NAME: 'Rốp Rẻng',
  APP_VERSION: '1.0.0',

  // OTP Configuration
  OTP_LENGTH: 6,
  OTP_TIMEOUT_SECONDS: 120, // 2 minutes
  OTP_MAX_RETRIES: 3,
} as const;

export type Environment = typeof ENV;
