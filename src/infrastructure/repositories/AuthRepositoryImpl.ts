
import { AuthRepository, RegisterResult, LoginResult } from '../../domain/repositories/AuthRepository';
import { httpClient } from '../http/HttpClient';
import { AUTH_ENDPOINTS } from '../api/auth/AuthApiConfig';
import { RegisterRequestDTO, RegisterResponseDTO, LoginRequestDTO, LoginResponseDTO } from '../../application/dto/AuthDTO';
import { AuthError, NetworkError, OtpInvalidError } from '../../core/errors/AppErrors';
import { AxiosError } from 'axios';
import { AuthMapper } from '../../application/mappers/AuthMapper';

export class AuthRepositoryImpl implements AuthRepository {
  private static instance: AuthRepositoryImpl;

  private constructor() {}

  public static getInstance(): AuthRepositoryImpl {
    if (!AuthRepositoryImpl.instance) {
      AuthRepositoryImpl.instance = new AuthRepositoryImpl();
    }
    return AuthRepositoryImpl.instance;
  }

  async register(phone: string): Promise<RegisterResult> {
    try {
      const request: RegisterRequestDTO = { phone };
      const response = await httpClient.post<RegisterResponseDTO>(
        AUTH_ENDPOINTS.REGISTER,
        request
      );

      const user = AuthMapper.toUser(response.user);

      return {
        user,
        otpSent: true,
      };
    } catch (error) {
      throw this.handleError(error, 'register');
    }
  }

  async login(phone: string, otp: string): Promise<LoginResult> {
    try {
      const request: LoginRequestDTO = { phone, otp };
      const response = await httpClient.post<LoginResponseDTO>(
        AUTH_ENDPOINTS.LOGIN,
        request
      );

      const user = AuthMapper.toUser(response.user);

      return {
        user,
        token: response.token,
      };
    } catch (error) {
      throw this.handleError(error, 'login');
    }
  }

  private handleError(error: unknown, operation: 'register' | 'login'): Error {
    if (error instanceof AxiosError) {
      if (!error.response) {
        return new NetworkError();
      }

      const status = error.response.status;
      const data = error.response.data as { message?: string } | undefined;
      const message = data?.message;

      switch (status) {
        case 400:
          if (operation === 'login' && message?.toLowerCase().includes('otp')) {
            return new OtpInvalidError();
          }
          return new AuthError(message || 'Dữ liệu không hợp lệ');

        case 401:
          return new OtpInvalidError();

        case 404:
          if (operation === 'login') {
            return new AuthError('Số điện thoại chưa được đăng ký');
          }
          return new AuthError('Không tìm thấy tài nguyên');

        case 429:
          return new AuthError('Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau');

        case 500:
        case 502:
        case 503:
          return new AuthError('Máy chủ đang bảo trì. Vui lòng thử lại sau');

        default:
          return new AuthError(message || 'Đã có lỗi xảy ra');
      }
    }

    if (error instanceof Error) {
      return new AuthError(error.message);
    }

    return new AuthError('Đã có lỗi không xác định');
  }
}

export const authRepository = AuthRepositoryImpl.getInstance();