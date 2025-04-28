import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Middleware para proteção de rotas e segurança
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Log para debug em desenvolvimento
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[Middleware] Processing: ${pathname}`);
  }

  // Verificação de autenticação para rotas protegidas
  if (pathname.startsWith('/dashboard')) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      const url = new URL('/login', request.url);
      // Adiciona callback url para redirecionar após login
      url.searchParams.set('callbackUrl', encodeURI(request.url));
      return NextResponse.redirect(url);
    }
  }

  // Configurar headers de segurança padrão
  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Para rotas de API
  if (pathname.startsWith('/api/')) {
    if (process.env.NODE_ENV !== 'production') {
      const ip = request.headers.get('x-forwarded-for') || 'unknown';
      console.log(`[API Request] ${request.method} ${pathname} - IP: ${ip}`);
    }
  }

  return response;
}

// Configurar rotas para aplicar o middleware
export const config = {
  matcher: [
    // Aplicar apenas às rotas do dashboard
    '/dashboard/:path*',
  ],
};
