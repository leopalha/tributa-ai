import { api } from './api';
import { Usuario, TokenAutenticacao, SessaoUsuario } from '@/types/usuario';
import { parseCookies, setCookie, destroyCookie } from 'nookies';

class AuthService {
  private static instance: AuthService;
  private baseUrl = '/auth';

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async login(email: string, senha: string): Promise<SessaoUsuario> {
    const response = await api.post(`${this.baseUrl}/login`, { email, senha });
    this.setTokens(response.token);
    return response;
  }

  public async loginComGoogle(token: string): Promise<SessaoUsuario> {
    const response = await api.post(`${this.baseUrl}/login/google`, { token });
    this.setTokens(response.token);
    return response;
  }

  public async registrar(dados: {
    nome: string;
    email: string;
    senha: string;
    confirmacaoSenha: string;
    tipo: string;
  }): Promise<SessaoUsuario> {
    const response = await api.post(`${this.baseUrl}/registrar`, dados);
    this.setTokens(response.token);
    return response;
  }

  public async logout(): Promise<void> {
    try {
      await api.post(`${this.baseUrl}/logout`);
    } finally {
      this.limparTokens();
    }
  }

  public async recuperarSenha(email: string): Promise<void> {
    return api.post(`${this.baseUrl}/recuperar-senha`, { email });
  }

  public async redefinirSenha(
    token: string,
    novaSenha: string,
    confirmacaoSenha: string
  ): Promise<void> {
    return api.post(`${this.baseUrl}/redefinir-senha`, {
      token,
      novaSenha,
      confirmacaoSenha,
    });
  }

  public async verificarEmail(token: string): Promise<void> {
    return api.post(`${this.baseUrl}/verificar-email`, { token });
  }

  public async reenviarVerificacaoEmail(email: string): Promise<void> {
    return api.post(`${this.baseUrl}/reenviar-verificacao`, { email });
  }

  public async obterUsuarioAtual(): Promise<Usuario | null> {
    try {
      return await api.get(`${this.baseUrl}/me`);
    } catch {
      return null;
    }
  }

  public async atualizarPerfil(dados: Partial<Usuario>): Promise<Usuario> {
    return api.put(`${this.baseUrl}/perfil`, dados);
  }

  public async alterarSenha(dados: {
    senhaAtual: string;
    novaSenha: string;
    confirmacaoSenha: string;
  }): Promise<void> {
    return api.put(`${this.baseUrl}/alterar-senha`, dados);
  }

  public async atualizarPreferencias(preferencias: Usuario['preferencias']): Promise<Usuario> {
    return api.put(`${this.baseUrl}/preferencias`, preferencias);
  }

  public async uploadFoto(
    arquivo: File,
    onProgress?: (progress: number) => void
  ): Promise<Usuario> {
    const formData = new FormData();
    formData.append('foto', arquivo);
    return api.upload(`${this.baseUrl}/foto`, formData, onProgress);
  }

  public async excluirConta(senha: string): Promise<void> {
    await api.post(`${this.baseUrl}/excluir-conta`, { senha });
    this.limparTokens();
  }

  public async obterSessoes(): Promise<
    {
      id: string;
      dispositivo: string;
      ip: string;
      ultimoAcesso: string;
      atual: boolean;
    }[]
  > {
    return api.get(`${this.baseUrl}/sessoes`);
  }

  public async encerrarSessao(id: string): Promise<void> {
    return api.delete(`${this.baseUrl}/sessoes/${id}`);
  }

  public async encerrarTodasSessoes(): Promise<void> {
    return api.delete(`${this.baseUrl}/sessoes`);
  }

  private setTokens(token: TokenAutenticacao): void {
    setCookie(undefined, 'tributa.ai.token', token.accessToken, {
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: '/',
    });

    setCookie(undefined, 'tributa.ai.refreshToken', token.refreshToken, {
      maxAge: 60 * 60 * 24 * 30, // 30 dias
      path: '/',
    });
  }

  private limparTokens(): void {
    destroyCookie(undefined, 'tributa.ai.token');
    destroyCookie(undefined, 'tributa.ai.refreshToken');
  }

  public isAutenticado(): boolean {
    const { 'tributa.ai.token': token } = parseCookies();
    return !!token;
  }
}

export const authService = AuthService.getInstance();
