import { AES, enc } from 'crypto-js';
import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'tributa_ai_token';
const ENCRYPTION_KEY = 'tributa_ai_secret_key_2024';

export interface TokenData {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
  userId: string;
  email: string;
  role: string;
}

class TokenStorage {
  private static instance: TokenStorage;

  public static getInstance(): TokenStorage {
    if (!TokenStorage.instance) {
      TokenStorage.instance = new TokenStorage();
    }
    return TokenStorage.instance;
  }

  private encrypt(data: string): string {
    return AES.encrypt(data, ENCRYPTION_KEY).toString();
  }

  private decrypt(encryptedData: string): string {
    const bytes = AES.decrypt(encryptedData, ENCRYPTION_KEY);
    return bytes.toString(enc.Utf8);
  }

  public setToken(tokenData: TokenData): void {
    try {
      const encrypted = this.encrypt(JSON.stringify(tokenData));
      localStorage.setItem(STORAGE_KEY, encrypted);
    } catch (error) {
      console.error('Error saving token:', error);
    }
  }

  public getToken(): TokenData | null {
    try {
      const encrypted = localStorage.getItem(STORAGE_KEY);
      if (!encrypted) return null;

      const decrypted = this.decrypt(encrypted);
      const tokenData: TokenData = JSON.parse(decrypted);

      // Check if token is expired
      if (Date.now() >= tokenData.expiresAt) {
        this.removeToken();
        return null;
      }

      return tokenData;
    } catch (error) {
      console.error('Error retrieving token:', error);
      this.removeToken();
      return null;
    }
  }

  public removeToken(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error removing token:', error);
    }
  }

  public isTokenValid(): boolean {
    const token = this.getToken();
    return token !== null;
  }

  public getAccessToken(): string | null {
    const token = this.getToken();
    return token?.accessToken || null;
  }

  public getRefreshToken(): string | null {
    const token = this.getToken();
    return token?.refreshToken || null;
  }

  public setTokens(accessToken: string, refreshToken?: string): void {
    const currentToken = this.getToken();
    const tokenData: TokenData = {
      accessToken,
      refreshToken,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 horas por padrão
      userId: currentToken?.userId || '',
      email: currentToken?.email || '',
      role: currentToken?.role || 'user',
    };
    this.setToken(tokenData);
  }

  public clearTokens(): void {
    this.removeToken();
  }

  public getUserInfo(): Pick<TokenData, 'userId' | 'email' | 'role'> | null {
    const token = this.getToken();
    if (!token) return null;

    return {
      userId: token.userId,
      email: token.email,
      role: token.role,
    };
  }

  public refreshToken(): Promise<boolean> {
    // This would typically make an API call to refresh the token
    // For now, we'll return a promise that resolves to false
    return Promise.resolve(false);
  }
}

// Export singleton instance
export const tokenStorage = TokenStorage.getInstance();

// React hook for using token storage
export function useTokenStorage() {
  const [token, setToken] = useState<TokenData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadToken = useCallback(() => {
    setIsLoading(true);
    const storedToken = tokenStorage.getToken();
    setToken(storedToken);
    setIsLoading(false);
  }, []);

  const saveToken = useCallback((tokenData: TokenData) => {
    tokenStorage.setToken(tokenData);
    setToken(tokenData);
  }, []);

  const clearToken = useCallback(() => {
    tokenStorage.removeToken();
    setToken(null);
  }, []);

  const refreshTokenData = useCallback(async () => {
    const success = await tokenStorage.refreshToken();
    if (success) {
      loadToken();
    } else {
      clearToken();
    }
    return success;
  }, [loadToken, clearToken]);

  useEffect(() => {
    loadToken();
  }, [loadToken]);

  return {
    token,
    isLoading,
    isAuthenticated: token !== null,
    saveToken,
    clearToken,
    refreshToken: refreshTokenData,
    loadToken,
    accessToken: token?.accessToken || null,
    userInfo: token
      ? {
          userId: token.userId,
          email: token.email,
          role: token.role,
        }
      : null,
  };
}

// Export default
export default tokenStorage;
