export class AppError extends Error {
  constructor(public message: string, public code: string) {
    super(message);
    this.name = 'AppError';
  }
}

export class NetworkError extends AppError {
  constructor() {
    super('Kết nối internet không ổn định, vui lòng kiểm tra', 'NETWORK_ERROR');
  }
}

export class QuotaExceededError extends AppError {
  constructor() {
    super('Máy chủ đang quá tải vui lòng thử lại sau', 'QUOTA_EXCEEDED');
  }
}

export class ApiError extends AppError {
  constructor(message: string) {
    super(message, 'API_ERROR');
  }
}