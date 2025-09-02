import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rotas que não precisam de autenticação
const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/cert/verify'];

// Rotas que precisam de autenticação
const protectedRoutes = ['/dashboard', '/empresas', '/usuarios', '/ativos', '/treinamentos', '/certificados', '/relatorios'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verificar se é uma rota pública
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  // Verificar se é uma rota protegida
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Se for rota pública, permitir acesso
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Se for rota protegida, verificar autenticação
  if (isProtectedRoute) {
    // Verificar se existe token no cookie ou header
    const token = request.cookies.get('accessToken')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      // Redirecionar para login se não autenticado
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Para outras rotas, permitir acesso
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
