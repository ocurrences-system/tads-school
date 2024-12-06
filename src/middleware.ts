import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: Request) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;

  // Permitir acesso sem autenticação às rotas específicas
  if (
    pathname.startsWith("/auth/login") || // Página de login
    pathname.startsWith("/api/auth") || // Rotas da API do NextAuth
    pathname.startsWith("/api/import") || // Permitir acesso à API de importação
    pathname.startsWith("/_next/static") || // Recursos estáticos do Next.js
    pathname.startsWith("/favicon.ico") || // Ícone de favicon
    pathname.startsWith("/public") // Outros recursos públicos
  ) {
    return NextResponse.next();
  }

  // Se não houver token, redirecionar para o login
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}

// Configuração do matcher
export const config = {
  matcher: [
    "/((?!api/auth|api/import|_next/static|favicon.ico|public).*)", // Excluir rotas específicas do middleware
  ],
};
