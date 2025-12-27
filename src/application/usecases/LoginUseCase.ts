import { AuthRepository, LoginResult } from '../../domain/repositories/AuthRepository';
import { TokenStorage } from '../../infrastructure/storage/tokenStorage';

export class LoginUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(phone: string, otp: string): Promise<LoginResult> {
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      throw new Error('Số điện thoại không hợp lệ');
    }

    if (otp.length !== 6) {
      throw new Error('Mã OTP phải có 6 chữ số');
    }

    const result = await this.authRepository.login(cleanPhone, otp);

    await TokenStorage.saveTokens(
      result.token,
      '',
      result.user.uuid
    );

    return result;
  }
}