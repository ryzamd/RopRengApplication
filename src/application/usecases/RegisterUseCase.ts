import { AuthRepository, RegisterResult } from '../../domain/repositories/AuthRepository';

export class RegisterUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(phone: string): Promise<RegisterResult> {
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      throw new Error('Số điện thoại phải có 10 chữ số');
    }

    return this.authRepository.register(cleanPhone);
  }
}