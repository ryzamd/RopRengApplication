/**
 * API Error
 * Custom error class for API errors with additional context
 */

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code?: string;
  public readonly data?: any;
  public readonly isApiError = true;

  constructor(
    message: string,
    statusCode: number,
    code?: string,
    data?: any
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.data = data;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  /**
   * Check if error is a network error
   */
  public isNetworkError(): boolean {
    return this.code === 'NETWORK_ERROR' || this.statusCode === 0;
  }

  /**
   * Check if error is a server error (5xx)
   */
  public isServerError(): boolean {
    return this.statusCode >= 500 && this.statusCode < 600;
  }

  /**
   * Check if error is a client error (4xx)
   */
  public isClientError(): boolean {
    return this.statusCode >= 400 && this.statusCode < 500;
  }

  /**
   * Check if error is unauthorized (401)
   */
  public isUnauthorized(): boolean {
    return this.statusCode === 401;
  }

  /**
   * Check if error is forbidden (403)
   */
  public isForbidden(): boolean {
    return this.statusCode === 403;
  }

  /**
   * Check if error is not found (404)
   */
  public isNotFound(): boolean {
    return this.statusCode === 404;
  }

  /**
   * Check if error is validation error (422)
   */
  public isValidationError(): boolean {
    return this.statusCode === 422;
  }

  /**
   * Get user-friendly error message
   */
  public getUserMessage(): string {
    if (this.isNetworkError()) {
      return 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
    }

    if (this.isServerError()) {
      return 'Lỗi server. Vui lòng thử lại sau.';
    }

    if (this.isUnauthorized()) {
      return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
    }

    if (this.isForbidden()) {
      return 'Bạn không có quyền thực hiện thao tác này.';
    }

    if (this.isNotFound()) {
      return 'Không tìm thấy dữ liệu.';
    }

    return this.message || 'Đã xảy ra lỗi. Vui lòng thử lại.';
  }

  /**
   * Convert to JSON for logging
   */
  public toJSON(): object {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      code: this.code,
      data: this.data,
      stack: this.stack,
    };
  }
}

/**
 * Type guard to check if error is ApiError
 */
export function isApiError(error: any): error is ApiError {
  return error?.isApiError === true;
}
