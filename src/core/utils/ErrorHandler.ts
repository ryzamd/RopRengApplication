/**
 * Error Handler
 * Global error handling and reporting
 *
 * Features:
 * - Catch and log errors
 * - User-friendly error messages
 * - Error reporting (future: Sentry, etc.)
 */

import { logger } from './Logger';

export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface AppError {
  code: string;
  message: string;
  userMessage?: string;
  severity: ErrorSeverity;
  originalError?: any;
  timestamp: number;
}

export class ErrorHandler {
  private static instance: ErrorHandler;

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Handle error
   */
  public handle(
    error: any,
    code: string = 'UNKNOWN_ERROR',
    severity: ErrorSeverity = ErrorSeverity.MEDIUM
  ): AppError {
    const appError: AppError = {
      code,
      message: this.extractMessage(error),
      userMessage: this.getUserFriendlyMessage(code),
      severity,
      originalError: error,
      timestamp: Date.now(),
    };

    // Log error
    logger.error(`[ErrorHandler] ${code}`, appError);

    // Report to crash reporting service (future)
    if (severity === ErrorSeverity.CRITICAL) {
      this.reportCriticalError(appError);
    }

    return appError;
  }

  /**
   * Extract error message
   */
  private extractMessage(error: any): string {
    if (error instanceof Error) {
      return error.message;
    }

    if (typeof error === 'string') {
      return error;
    }

    return JSON.stringify(error);
  }

  /**
   * Get user-friendly error message
   */
  private getUserFriendlyMessage(code: string): string {
    const messages: Record<string, string> = {
      NETWORK_ERROR: 'Không thể kết nối. Vui lòng kiểm tra kết nối mạng.',
      DATABASE_ERROR: 'Lỗi lưu trữ dữ liệu. Vui lòng thử lại.',
      AUTH_ERROR: 'Lỗi xác thực. Vui lòng đăng nhập lại.',
      PAYMENT_ERROR: 'Lỗi thanh toán. Vui lòng thử lại.',
      NOT_FOUND: 'Không tìm thấy dữ liệu.',
      VALIDATION_ERROR: 'Dữ liệu không hợp lệ.',
      UNKNOWN_ERROR: 'Đã xảy ra lỗi. Vui lòng thử lại.',
    };

    return messages[code] || messages.UNKNOWN_ERROR;
  }

  /**
   * Report critical error (future: Sentry integration)
   */
  private reportCriticalError(error: AppError): void {
    console.error('[ErrorHandler] CRITICAL ERROR:', error);
    // TODO: Send to Sentry or other error tracking service
  }

  /**
   * Create custom error
   */
  public createError(
    code: string,
    message: string,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM
  ): AppError {
    return {
      code,
      message,
      userMessage: this.getUserFriendlyMessage(code),
      severity,
      timestamp: Date.now(),
    };
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance();
