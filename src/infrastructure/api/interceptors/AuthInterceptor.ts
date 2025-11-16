/**
 * Auth Interceptor
 * Adds authentication token to requests
 */

import { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEYS } from '../../../config/constants';
import { Logger } from '../../../core/utils/Logger';

/**
 * Setup authentication interceptor
 */
export function setupAuthInterceptor(axiosInstance: AxiosInstance): void {
  axiosInstance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      try {
        // Get auth token from secure storage
        const token = await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      } catch (error) {
        Logger.error('Auth Interceptor Error', error);
        return config;
      }
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}

/**
 * Clear auth token from storage
 */
export async function clearAuthToken(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
    Logger.info('Auth token cleared');
  } catch (error) {
    Logger.error('Error clearing auth token', error);
  }
}

/**
 * Save auth token to storage
 */
export async function saveAuthToken(token: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, token);
    Logger.info('Auth token saved');
  } catch (error) {
    Logger.error('Error saving auth token', error);
    throw error;
  }
}

/**
 * Get current auth token
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
  } catch (error) {
    Logger.error('Error getting auth token', error);
    return null;
  }
}
