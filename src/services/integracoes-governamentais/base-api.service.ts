import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG, DEFAULT_HEADERS } from './config';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

export abstract class BaseAPIService {
  protected api: AxiosInstance;
  private cache = new Map<string, CacheEntry<any>>();
  private rateLimits = new Map<string, RateLimitEntry>();

  constructor(baseURL: string, additionalHeaders?: Record<string, string>) {
    this.api = axios.create({
      baseURL,
      timeout: API_CONFIG.TIMEOUT.DEFAULT,
      headers: {
        ...DEFAULT_HEADERS,
        ...additionalHeaders
      }
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[API Request Error]', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => {
        console.log(`[API Response] ${response.status} ${response.config.url}`);
        return response;
      },
      async (error) => {
        console.error('[API Response Error]', error.message);
        
        // Retry logic for network errors
        if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
          const config = error.config;
          config.retryCount = config.retryCount || 0;
          
          if (config.retryCount < API_CONFIG.RETRY.MAX_ATTEMPTS) {
            config.retryCount++;
            const delay = Math.min(
              API_CONFIG.RETRY.INITIAL_DELAY * Math.pow(API_CONFIG.RETRY.BACKOFF_FACTOR, config.retryCount - 1),
              API_CONFIG.RETRY.MAX_DELAY
            );
            
            console.log(`[API Retry] Attempt ${config.retryCount} after ${delay}ms`);
            await this.sleep(delay);
            
            return this.api(config);
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  /**
   * Fazer requisição com cache
   */
  protected async requestWithCache<T>(
    key: string,
    request: () => Promise<AxiosResponse<T>>,
    ttl: number = API_CONFIG.CACHE_TTL.DEFAULT
  ): Promise<T> {
    // Verificar cache
    const cached = this.getFromCache<T>(key);
    if (cached) {
      console.log(`[Cache Hit] ${key}`);
      return cached;
    }

    // Fazer requisição
    const response = await request();
    const data = response.data;

    // Salvar no cache
    this.saveToCache(key, data, ttl);

    return data;
  }

  /**
   * Fazer requisição com rate limiting
   */
  protected async requestWithRateLimit<T>(
    limitKey: string,
    request: () => Promise<AxiosResponse<T>>,
    maxRequests: number = API_CONFIG.RATE_LIMITS.DEFAULT.requests,
    windowMs: number = API_CONFIG.RATE_LIMITS.DEFAULT.window
  ): Promise<T> {
    // Verificar rate limit
    await this.checkRateLimit(limitKey, maxRequests, windowMs);

    // Fazer requisição
    const response = await request();

    // Incrementar contador
    this.incrementRateLimit(limitKey, windowMs);

    return response.data;
  }

  /**
   * Verificar rate limit
   */
  private async checkRateLimit(key: string, maxRequests: number, windowMs: number): Promise<void> {
    const now = Date.now();
    const limit = this.rateLimits.get(key);

    if (!limit || now > limit.resetTime) {
      // Reset ou criar novo limite
      this.rateLimits.set(key, { count: 0, resetTime: now + windowMs });
      return;
    }

    if (limit.count >= maxRequests) {
      const waitTime = limit.resetTime - now;
      console.log(`[Rate Limit] Waiting ${waitTime}ms for ${key}`);
      await this.sleep(waitTime);
      
      // Reset após esperar
      this.rateLimits.set(key, { count: 0, resetTime: now + windowMs });
    }
  }

  /**
   * Incrementar contador de rate limit
   */
  private incrementRateLimit(key: string, windowMs: number): void {
    const now = Date.now();
    const limit = this.rateLimits.get(key);

    if (!limit || now > limit.resetTime) {
      this.rateLimits.set(key, { count: 1, resetTime: now + windowMs });
    } else {
      limit.count++;
    }
  }

  /**
   * Obter do cache
   */
  private getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;

    const now = Date.now();
    if (now > entry.timestamp + entry.ttl) {
      // Cache expirado
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Salvar no cache
   */
  private saveToCache<T>(key: string, data: T, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  /**
   * Limpar cache
   */
  protected clearCache(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    // Limpar por padrão
    const keysToDelete: string[] = [];
    this.cache.forEach((_, key) => {
      if (key.includes(pattern)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Validar CNPJ
   */
  protected validateCNPJ(cnpj: string): boolean {
    const cleaned = cnpj.replace(/[^\d]/g, '');
    
    if (cleaned.length !== 14) return false;
    if (/^(\d)\1+$/.test(cleaned)) return false;

    const digits = cleaned.split('').map(Number);

    // Primeiro dígito verificador
    let sum = 0;
    let weight = 5;
    for (let i = 0; i < 12; i++) {
      sum += digits[i] * weight;
      weight = weight === 2 ? 9 : weight - 1;
    }
    let remainder = sum % 11;
    const dv1 = remainder < 2 ? 0 : 11 - remainder;

    if (digits[12] !== dv1) return false;

    // Segundo dígito verificador
    sum = 0;
    weight = 6;
    for (let i = 0; i < 13; i++) {
      sum += digits[i] * weight;
      weight = weight === 2 ? 9 : weight - 1;
    }
    remainder = sum % 11;
    const dv2 = remainder < 2 ? 0 : 11 - remainder;

    return digits[13] === dv2;
  }

  /**
   * Validar CPF
   */
  protected validateCPF(cpf: string): boolean {
    const cleaned = cpf.replace(/[^\d]/g, '');
    
    if (cleaned.length !== 11) return false;
    if (/^(\d)\1+$/.test(cleaned)) return false;

    const digits = cleaned.split('').map(Number);

    // Primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += digits[i] * (10 - i);
    }
    let remainder = sum % 11;
    const dv1 = remainder < 2 ? 0 : 11 - remainder;

    if (digits[9] !== dv1) return false;

    // Segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += digits[i] * (11 - i);
    }
    remainder = sum % 11;
    const dv2 = remainder < 2 ? 0 : 11 - remainder;

    return digits[10] === dv2;
  }

  /**
   * Formatar CNPJ
   */
  protected formatCNPJ(cnpj: string): string {
    const cleaned = cnpj.replace(/[^\d]/g, '');
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }

  /**
   * Formatar CPF
   */
  protected formatCPF(cpf: string): string {
    const cleaned = cpf.replace(/[^\d]/g, '');
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  /**
   * Formatar CEP
   */
  protected formatCEP(cep: string): string {
    const cleaned = cep.replace(/[^\d]/g, '');
    return cleaned.replace(/(\d{5})(\d{3})/, '$1-$2');
  }

  /**
   * Limpar string de formatação
   */
  protected cleanString(str: string): string {
    return str.replace(/[^\d]/g, '');
  }
}