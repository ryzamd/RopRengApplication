import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { TokenStorage } from '../../storage/tokenStorage';

export async function authRequestInterceptor(config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
  const { accessToken } = await TokenStorage.getTokens();

  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
}

export function requestErrorHandler(error: AxiosError): Promise<never> {
  return Promise.reject(error);
}

export function responseInterceptor(response: AxiosResponse): AxiosResponse {
  return response;
}

export async function responseErrorHandler(error: AxiosError): Promise<never> {
  if (error.response?.status === 401) {
    // Token expired or invalid
    // TODO: Implement refresh token flow when available
    // For now, clear tokens and let app handle re-auth
    await TokenStorage.clearTokens();
  }

  return Promise.reject(error);
}