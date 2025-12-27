import { User } from '../entities/User';

export interface RegisterResult {
  user: User;
  otpSent: boolean;
}

export interface LoginResult {
  user: User;
  token: string;
}

export interface AuthRepository {
  register(phone: string): Promise<RegisterResult>;
  login(phone: string, otp: string): Promise<LoginResult>;

  // TODO: Add when API supports
  // refreshToken(refreshToken: string): Promise<{ accessToken: string }>;
  // logout(): Promise<void>;
  // updateProfile(data: UpdateProfileDTO): Promise<User>;
}