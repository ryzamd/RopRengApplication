/**
 * API Client
 * HTTP client wrapper with interceptors and error handling
 */

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';
import { ENV } from '../../config/env';
import { Logger } from '../../core/utils/Logger';
import { ApiError } from './ApiError';
import { setupAuthInterceptor } from './interceptors/AuthInterceptor';
import { setupRetryInterceptor } from './interceptors/RetryInterceptor';

export class ApiClient {
  private static instance: ApiClient;
  private axiosInstance: AxiosInstance;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: ENV.API_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  /**
   * Setup request/response interceptors
   */
  private setupInterceptors(): void {
    // Auth interceptor - adds auth token to requests
    setupAuthInterceptor(this.axiosInstance);

    // Retry interceptor - retries failed requests
    setupRetryInterceptor(this.axiosInstance);

    // Response interceptor - handle errors
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        return Promise.reject(this.handleError(error));
      }
    );

    // Request logger (development only)
    if (ENV.isDevelopment) {
      this.axiosInstance.interceptors.request.use((config) => {
        Logger.debug('API Request', {
          method: config.method?.toUpperCase(),
          url: config.url,
          params: config.params,
          data: config.data,
        });
        return config;
      });

      this.axiosInstance.interceptors.response.use((response) => {
        Logger.debug('API Response', {
          status: response.status,
          url: response.config.url,
          data: response.data,
        });
        return response;
      });
    }
  }

  /**
   * Handle API errors
   */
  private handleError(error: AxiosError): ApiError {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      Logger.error('API Error Response', {
        status,
        data,
        url: error.config?.url,
      });

      return new ApiError(
        (data as any)?.message || 'Server error',
        status,
        (data as any)?.code,
        data
      );
    } else if (error.request) {
      // Request was made but no response received
      Logger.error('API No Response', {
        url: error.config?.url,
        message: error.message,
      });

      return new ApiError(
        'Network error - no response from server',
        0,
        'NETWORK_ERROR'
      );
    } else {
      // Error setting up the request
      Logger.error('API Request Setup Error', {
        message: error.message,
      });

      return new ApiError('Request setup error', 0, 'REQUEST_ERROR');
    }
  }

  /**
   * GET request
   */
  public async get<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get<T>(url, config);
  }

  /**
   * POST request
   */
  public async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post<T>(url, data, config);
  }

  /**
   * PUT request
   */
  public async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put<T>(url, data, config);
  }

  /**
   * PATCH request
   */
  public async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.patch<T>(url, data, config);
  }

  /**
   * DELETE request
   */
  public async delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete<T>(url, config);
  }

  /**
   * Get raw axios instance (for advanced usage)
   */
  public getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

// Export singleton instance
export const apiClient = ApiClient.getInstance();
