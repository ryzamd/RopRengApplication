import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { TokenStorage } from '../../storage/tokenStorage';

const ENABLE_LOGGING = __DEV__;
function logRequest(config: InternalAxiosRequestConfig): void {
  if (!ENABLE_LOGGING) return;

  console.log('\n═══════════ API REQUEST ═══════════');
  console.log(`${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  console.log('Headers:', JSON.stringify(config.headers, null, 2));
  if (config.data) {
    console.log('Body:', JSON.stringify(config.data, null, 2));
  }
  if (config.params) {
    console.log('Params:', JSON.stringify(config.params, null, 2));
  }
  console.log('═══════════════════════════════════════\n');
}

function logResponse(response: AxiosResponse): void {
  if (!ENABLE_LOGGING) return;

  console.log('\n═══════════ API RESPONSE ═══════════');
  console.log(`${response.config.method?.toUpperCase()} ${response.config.url}`);
  console.log(`Status: ${response.status} ${response.statusText}`);
  console.log('Data:', JSON.stringify(response.data, null, 2));
  console.log('═══════════════════════════════════════\n');
}

function logError(error: AxiosError): void {
  if (!ENABLE_LOGGING) return;

  console.log('\n ═══════════ API ERROR ═══════════');
  console.log(`${error.config?.method?.toUpperCase()} ${error.config?.url}`);
  console.log(`Status: ${error.response?.status || 'No response'}`);
  console.log('Message:', error.message);
  if (error.response?.data) {
    console.log('Error Data:', JSON.stringify(error.response.data, null, 2));
  }
  console.log('═══════════════════════════════════════\n');
}

export async function authRequestInterceptor(config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
  const { accessToken } = await TokenStorage.getTokens();

  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  logRequest(config);

  return config;
}

export function requestErrorHandler(error: AxiosError): Promise<never> {
  logError(error);

  return Promise.reject(error);
}

export function responseInterceptor(response: AxiosResponse): AxiosResponse {
  logResponse(response);

  return response;
}

export async function responseErrorHandler(error: AxiosError): Promise<never> {
  logError(error);

  if (error.response?.status === 401) {
    // Token expired or invalid
    // TODO: Implement refresh token flow when available
    // For now, clear tokens and let app handle re-auth
    await TokenStorage.clearTokens();
  }

  return Promise.reject(error);
}