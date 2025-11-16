/**
 * Retry Interceptor
 * Automatically retries failed requests with exponential backoff
 */

import { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { Logger } from '../../../core/utils/Logger';

interface RetryConfig {
  retryCount?: number;
  retryDelay?: number;
  maxRetries?: number;
}

/**
 * Setup retry interceptor
 */
export function setupRetryInterceptor(
  axiosInstance: AxiosInstance,
  config: RetryConfig = {}
): void {
  const { maxRetries = 3, retryDelay = 1000 } = config;

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & RetryConfig;

      if (!originalRequest) {
        return Promise.reject(error);
      }

      // Initialize retry count
      originalRequest.retryCount = originalRequest.retryCount || 0;

      // Check if we should retry
      if (!shouldRetry(error, originalRequest, maxRetries)) {
        return Promise.reject(error);
      }

      // Increment retry count
      originalRequest.retryCount += 1;

      // Calculate delay with exponential backoff
      const delay = calculateDelay(originalRequest.retryCount, retryDelay);

      Logger.warn('Retrying request', {
        url: originalRequest.url,
        attempt: originalRequest.retryCount,
        maxRetries,
        delay,
      });

      // Wait before retrying
      await sleep(delay);

      // Retry the request
      return axiosInstance(originalRequest);
    }
  );
}

/**
 * Determine if request should be retried
 */
function shouldRetry(
  error: AxiosError,
  config: InternalAxiosRequestConfig & RetryConfig,
  maxRetries: number
): boolean {
  // Don't retry if max retries reached
  if ((config.retryCount || 0) >= maxRetries) {
    return false;
  }

  // Don't retry if no response (network error)
  if (!error.response) {
    return true;
  }

  const { status } = error.response;

  // Retry on server errors (5xx)
  if (status >= 500 && status < 600) {
    return true;
  }

  // Retry on rate limit (429)
  if (status === 429) {
    return true;
  }

  // Retry on request timeout (408)
  if (status === 408) {
    return true;
  }

  // Don't retry client errors (4xx) except the ones above
  return false;
}

/**
 * Calculate delay with exponential backoff
 * Formula: baseDelay * (2 ^ attempt) + random jitter
 */
function calculateDelay(attempt: number, baseDelay: number): number {
  const exponentialDelay = baseDelay * Math.pow(2, attempt - 1);
  const jitter = Math.random() * 200; // 0-200ms random jitter
  return Math.min(exponentialDelay + jitter, 30000); // Max 30 seconds
}

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Custom retry configuration for specific requests
 */
export function withRetry(
  config: InternalAxiosRequestConfig,
  retryOptions: RetryConfig
): InternalAxiosRequestConfig & RetryConfig {
  return {
    ...config,
    ...retryOptions,
  };
}
