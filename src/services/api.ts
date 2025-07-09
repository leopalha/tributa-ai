import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import {
  mockBlockchainStatus,
  mockBlockchainQuery,
  mockBlockchainInvoke,
  mockBlockchainHistory,
} from './mock-api';
import { API_CONFIG } from '@/config/api.config';
import { tokenStorage } from '@/lib/token-storage';

// Implementação simples de cookies para Vite
const parseCookies = () => {
  const cookies: Record<string, string> = {};
  if (typeof document !== 'undefined') {
    document.cookie.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        cookies[name] = decodeURIComponent(value);
      }
    });
  }
  return cookies;
};

// API Error class
export class ApiError extends Error {
  constructor(
    public message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Simplified API class
class Api {
  private api: AxiosInstance;
  private static instance: Api;

  private constructor() {
    const token = tokenStorage.getAccessToken();

    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      headers: {
        ...API_CONFIG.HEADERS,
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      timeout: API_CONFIG.TIMEOUTS.DEFAULT,
      validateStatus: status => status >= 200 && status < 500,
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
    // Request interceptor para adicionar token atualizado
    this.api.interceptors.request.use(
      config => {
        const token = tokenStorage.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      response => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Tentar renovar o token
          try {
            const refreshToken = tokenStorage.getRefreshToken();
            if (refreshToken) {
              const response = await axios.post(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REFRESH}`,
                { refreshToken }
              );

              if (response.data.accessToken) {
                tokenStorage.setTokens(response.data.accessToken, response.data.refreshToken);

                // Retry original request
                const originalRequest = error.config;
                if (originalRequest) {
                  originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
                  return this.api(originalRequest);
                }
              }
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            tokenStorage.clearTokens();
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
          }
        }
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: AxiosError): ApiError {
    if (error.response) {
      const { data, status } = error.response;
      const errorData = data as any;
      return new ApiError(errorData?.message || 'Erro na requisição', status, errorData?.code);
    }
    return new ApiError(error.message || 'Erro de conexão', 0, 'NETWORK_ERROR');
  }

  public async get<T = any>(url: string, params?: any): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.get(url, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async post<T = any>(url: string, data?: any): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.post(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async put<T = any>(url: string, data?: any): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.put(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async delete<T = any>(url: string): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.delete(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async patch<T = any>(url: string, data?: any): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.patch(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async upload<T = any>(
    url: string,
    formData: FormData,
    onProgress?: (progress: number) => void
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: progressEvent => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async download(url: string, filename?: string): Promise<void> {
    try {
      const response = await this.api.get(url, {
        responseType: 'blob',
      });

      // Criar link para download
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      throw error;
    }
  }

  // Métodos adicionais para facilitar integrações
  public setAuthToken(token: string): void {
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  public removeAuthToken(): void {
    delete this.api.defaults.headers.common['Authorization'];
  }

  public async uploadWithProgress<T = any>(
    url: string,
    formData: FormData,
    onProgress?: (progress: number) => void
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: API_CONFIG.TIMEOUTS.UPLOAD,
        onUploadProgress: progressEvent => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

// Export singleton instance
const api = Api.getInstance();
export default api;

// Named export for compatibility with existing imports
export { api };

// Export blockchain API with mock option
export const blockchainApi = {
  status: async () => {
    if (API_CONFIG.USE_MOCK_BLOCKCHAIN) {
      console.log('Using mock blockchain status data');
      return mockBlockchainStatus;
    }

    try {
      const response = await api.get(API_CONFIG.ENDPOINTS.BLOCKCHAIN.STATUS);
      return response;
    } catch (error) {
      console.error('Error checking blockchain status:', error);
      // Fallback para mock em caso de erro
      return mockBlockchainStatus;
    }
  },

  consultar: async (funcao: string, args: string[]) => {
    if (API_CONFIG.USE_MOCK_BLOCKCHAIN) {
      console.log(`Using mock blockchain query data for ${funcao}`);
      return mockBlockchainQuery(funcao, args);
    }

    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.BLOCKCHAIN.QUERY, { funcao, args });
      return response;
    } catch (error) {
      console.error('Error querying blockchain:', error);
      // Fallback para mock em caso de erro
      return mockBlockchainQuery(funcao, args);
    }
  },

  invocar: async (funcao: string, args: string[]) => {
    if (API_CONFIG.USE_MOCK_BLOCKCHAIN) {
      console.log(`Using mock blockchain invoke data for ${funcao}`);
      return mockBlockchainInvoke(funcao, args);
    }

    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.BLOCKCHAIN.INVOKE, { funcao, args });
      return response;
    } catch (error) {
      console.error('Error invoking blockchain:', error);
      // Fallback para mock em caso de erro
      return mockBlockchainInvoke(funcao, args);
    }
  },

  historico: async (chave: string) => {
    if (API_CONFIG.USE_MOCK_BLOCKCHAIN) {
      console.log(`Using mock blockchain history data for ${chave}`);
      return mockBlockchainHistory(chave);
    }

    try {
      const response = await api.get(API_CONFIG.ENDPOINTS.BLOCKCHAIN.HISTORY(chave));
      return response;
    } catch (error) {
      console.error('Error getting blockchain history:', error);
      // Fallback para mock em caso de erro
      return mockBlockchainHistory(chave);
    }
  },

  // Novos métodos para funcionalidades específicas
  getPeers: async () => {
    try {
      const response = await api.get(API_CONFIG.ENDPOINTS.BLOCKCHAIN.PEERS);
      return response;
    } catch (error) {
      console.error('Error getting peers:', error);
      return { peers: [] };
    }
  },

  getChannels: async () => {
    try {
      const response = await api.get(API_CONFIG.ENDPOINTS.BLOCKCHAIN.CHANNELS);
      return response;
    } catch (error) {
      console.error('Error getting channels:', error);
      return { channels: [] };
    }
  },

  getContracts: async () => {
    try {
      const response = await api.get(API_CONFIG.ENDPOINTS.BLOCKCHAIN.CONTRACTS);
      return response;
    } catch (error) {
      console.error('Error getting contracts:', error);
      return { contracts: [] };
    }
  },
};

// Export auth API
export const authApi = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, { email, password });

      // Salvar tokens se retornados
      if (response.accessToken && response.refreshToken) {
        tokenStorage.setTokens(response.accessToken, response.refreshToken);
        api.setAuthToken(response.accessToken);
      }

      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Sempre limpar tokens localmente
      tokenStorage.clearTokens();
      api.removeAuthToken();

      // Redirecionar para login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  },

  register: async (data: any) => {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, data);
      return response;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  resetPassword: async (email: string) => {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD, { email });
      return response;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },
};
