import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { HTTP_CONFIG } from './HttpConfig';
import { authRequestInterceptor, requestErrorHandler, responseErrorHandler, responseInterceptor } from './interceptors/AuthInterceptor';

class HttpClient {
  private static instance: HttpClient;
  private axiosInstance: AxiosInstance;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: HTTP_CONFIG.BASE_URL,
      timeout: HTTP_CONFIG.TIMEOUT,
      headers: HTTP_CONFIG.HEADERS,
    });

    this.setupInterceptors();
  }

  public static getInstance(): HttpClient {
    if (!HttpClient.instance) {
      HttpClient.instance = new HttpClient();
    }
    return HttpClient.instance;
  }

  private setupInterceptors(): void {
    this.axiosInstance.interceptors.request.use(
      authRequestInterceptor,
      requestErrorHandler
    );

    this.axiosInstance.interceptors.response.use(
      responseInterceptor,
      responseErrorHandler
    );

    this.axiosInstance.interceptors.request.use(this.logRequest, this.logError);
    this.axiosInstance.interceptors.response.use(this.logResponse, this.logError);
  }

  private logRequest = (config: InternalAxiosRequestConfig) => {
    console.log(' ');
    console.log(`[API REQUEST] ${config.method?.toUpperCase()} ${config.url}`);
    
    if (config.params) {
      console.log('   🔹 Params:', JSON.stringify(config.params, null, 2));
    }
    
    if (config.data) {
       const dataLog = JSON.stringify(config.data, null, 2);
       console.log('Body:', dataLog.length > 2000 ? '[Data too long]' : dataLog);
    }
    
    return config;
  };

  private logResponse = (response: AxiosResponse) => {
    console.log(`[API RESPONSE] ${response.status} ${response.config.url}`);
    console.log(' Headers:', JSON.stringify(response.headers));
    
    if (response.data) {
        const responseData = JSON.stringify(response.data, null, 2);
        const shouldTruncate = responseData.length > 5000;
        console.log('Data:', shouldTruncate ? responseData.substring(0, 5000) + '... [TRUNCATED]' : responseData);
    }
    console.log(' ');
    
    return response;
  };

  private logError = (error: AxiosError) => {
    console.log(' ');
    if (error.response) {
      console.log(`[API ERROR] ${error.response.status} ${error.config?.url}`);
      console.log('Message:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.log(`[API ERROR] No Response received from ${error.config?.url}`);
      console.log('Request:', error.request);
    } else {
      console.log('[API ERROR] Request Setup Error:', error.message);
    }
    console.log(' ');
    
    return Promise.reject(error);
  };

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.get(url, config);
    return response.data;
  }

  public async post<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.post(url, data, config);
    return response.data;
  }

  public async put<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.put(url, data, config);
    return response.data;
  }

  public async patch<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.patch(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.delete(url, config);
    return response.data;
  }

  public getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

export const httpClient = HttpClient.getInstance();

export { HttpClient };

