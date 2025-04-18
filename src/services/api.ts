import axios, { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { parseCookies, setCookie, destroyCookie } from 'nookies';
import { TokenAutenticacao } from '@/types/usuario';

// Extend AxiosRequestConfig to include metadata
interface RequestConfig extends InternalAxiosRequestConfig {
  metadata?: {
    startTime: number;
  };
}

// Cache interface
interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

// Performance metrics interface
interface ApiMetrics {
  requestCount: number;
  errorCount: number;
  averageResponseTime: number;
  lastResponseTime: number;
}

// API Error Response interface
interface ApiErrorResponse {
  message: string;
  code?: string;
  errors?: any[];
}

export class ApiError extends Error {
  constructor(
    public message: string,
    public status: number,
    public code?: string,
    public errors?: any[],
    public retryAfter?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class Api {
  private api: AxiosInstance;
  private static instance: Api;
  private cache: Map<string, CacheItem<any>> = new Map();
  private metrics: ApiMetrics = {
    requestCount: 0,
    errorCount: 0,
    averageResponseTime: 0,
    lastResponseTime: 0
  };
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000; // 1 second

  private constructor() {
    const { 'tributa.ai.token': token } = parseCookies();

    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      },
      timeout: 30000, // 30 seconds timeout
      validateStatus: (status) => status >= 200 && status < 500
    });

    this.setupInterceptors();
  }

  public static getInstance(): Api {
    if (!Api.instance) {
      Api.instance = new Api();
    }
    return Api.instance;
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const configWithMetadata = config as RequestConfig;
        configWithMetadata.metadata = { startTime: Date.now() };
        return configWithMetadata;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => {
        const endTime = Date.now();
        const config = response.config as RequestConfig;
        const startTime = config.metadata?.startTime || endTime;
        const responseTime = endTime - startTime;

        this.updateMetrics(responseTime);
        return response;
      },
      async (error: AxiosError) => {
        this.metrics.errorCount++;
        const originalRequest = error.config as RequestConfig;
        
        if (error.response?.status === 401) {
          try {
            const { 'tributa.ai.refreshToken': refreshToken } = parseCookies();
            
            if (refreshToken && originalRequest) {
              const response = await this.refreshToken(refreshToken);
              
              if (response) {
                this.updateToken(response.accessToken);
                if (originalRequest.headers) {
                  originalRequest.headers['Authorization'] = `Bearer ${response.accessToken}`;
                }
                return this.api(originalRequest);
              }
            }
          } catch (refreshError) {
            this.handleAuthError();
          }
        }

        // Handle rate limiting
        if (error.response?.status === 429) {
          const retryAfter = parseInt(error.response.headers['retry-after'] || '1');
          return new Promise(resolve => {
            setTimeout(() => {
              resolve(this.api(originalRequest));
            }, retryAfter * 1000);
          });
        }

        return Promise.reject(this.handleError(error));
      }
    );
  }

  private updateMetrics(responseTime: number): void {
    this.metrics.requestCount++;
    this.metrics.lastResponseTime = responseTime;
    this.metrics.averageResponseTime = 
      (this.metrics.averageResponseTime * (this.metrics.requestCount - 1) + responseTime) / 
      this.metrics.requestCount;
  }

  private async refreshToken(refreshToken: string): Promise<TokenAutenticacao | null> {
    try {
      const response = await this.api.post('/auth/refresh-token', { refreshToken });
      return response.data;
    } catch (error) {
      return null;
    }
  }

  private updateToken(token: string): void {
    setCookie(undefined, 'tributa.ai.token', token, {
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
  }

  private handleAuthError(): void {
    destroyCookie(undefined, 'tributa.ai.token');
    destroyCookie(undefined, 'tributa.ai.refreshToken');
    window.location.href = '/login';
  }

  private handleError(error: AxiosError): ApiError {
    if (error.response) {
      const { data, status, headers } = error.response;
      const errorData = data as ApiErrorResponse;
      return new ApiError(
        errorData.message || 'Erro na requisição',
        status,
        errorData.code,
        errorData.errors,
        parseInt(headers['retry-after'] || '0')
      );
    }
    return new ApiError(
      error.message || 'Erro de conexão',
      0,
      'NETWORK_ERROR'
    );
  }

  private getCacheKey(url: string, params?: any): string {
    return `${url}:${JSON.stringify(params || {})}`;
  }

  private getFromCache<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (item && Date.now() - item.timestamp < item.expiresIn) {
      return item.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache<T>(key: string, data: T, expiresIn: number = this.CACHE_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresIn
    });
  }

  public async get<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
    const cacheKey = this.getCacheKey(url, params);
    const cachedData = this.getFromCache<T>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    let retries = 0;
    while (retries < this.MAX_RETRIES) {
      try {
        const response = await this.api.get<T>(url, { params, ...config });
        this.setCache(cacheKey, response.data);
        return response.data;
      } catch (error) {
        if (retries === this.MAX_RETRIES - 1) {
          throw this.handleError(error as AxiosError);
        }
        retries++;
        await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY * retries));
      }
    }
    throw new ApiError('Max retries exceeded', 0, 'MAX_RETRIES_EXCEEDED');
  }

  public async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    let retries = 0;
    while (retries < this.MAX_RETRIES) {
      try {
        const response = await this.api.post<T>(url, data, config);
        return response.data;
      } catch (error) {
        if (retries === this.MAX_RETRIES - 1) {
          throw this.handleError(error as AxiosError);
        }
        retries++;
        await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY * retries));
      }
    }
    throw new ApiError('Max retries exceeded', 0, 'MAX_RETRIES_EXCEEDED');
  }

  public async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    let retries = 0;
    while (retries < this.MAX_RETRIES) {
      try {
        const response = await this.api.put<T>(url, data, config);
        return response.data;
      } catch (error) {
        if (retries === this.MAX_RETRIES - 1) {
          throw this.handleError(error as AxiosError);
        }
        retries++;
        await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY * retries));
      }
    }
    throw new ApiError('Max retries exceeded', 0, 'MAX_RETRIES_EXCEEDED');
  }

  public async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    let retries = 0;
    while (retries < this.MAX_RETRIES) {
      try {
        const response = await this.api.delete<T>(url, config);
        return response.data;
      } catch (error) {
        if (retries === this.MAX_RETRIES - 1) {
          throw this.handleError(error as AxiosError);
        }
        retries++;
        await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY * retries));
      }
    }
    throw new ApiError('Max retries exceeded', 0, 'MAX_RETRIES_EXCEEDED');
  }

  public async upload(url: string, file: File, onProgress?: (progress: number) => void): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent: any) => {
        if (onProgress) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      }
    };

    let retries = 0;
    while (retries < this.MAX_RETRIES) {
      try {
        const response = await this.api.post(url, formData, config);
        return response.data;
      } catch (error) {
        if (retries === this.MAX_RETRIES - 1) {
          throw this.handleError(error as AxiosError);
        }
        retries++;
        await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY * retries));
      }
    }
    throw new ApiError('Max retries exceeded', 0, 'MAX_RETRIES_EXCEEDED');
  }

  public async download(url: string, filename: string): Promise<void> {
    let retries = 0;
    while (retries < this.MAX_RETRIES) {
      try {
        const response = await this.api.get(url, {
          responseType: 'blob'
        });

        const blob = new Blob([response.data]);
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      } catch (error) {
        if (retries === this.MAX_RETRIES - 1) {
          throw this.handleError(error as AxiosError);
        }
        retries++;
        await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY * retries));
      }
    }
    throw new ApiError('Max retries exceeded', 0, 'MAX_RETRIES_EXCEEDED');
  }

  public getMetrics(): ApiMetrics {
    return { ...this.metrics };
  }

  public clearCache(): void {
    this.cache.clear();
  }
}

export const api = Api.getInstance(); 