import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Proteggi tutte le route che iniziano con /admin
  if (pathname.startsWith('/admin')) {
    try {
      // Verifica il token JWT di NextAuth
      const token = await getToken({ 
        req: request,
        secret: process.env.NEXTAUTH_SECRET 
      });

      // Se non c'è token, reindirizza al login
      if (!token) {
        const loginUrl = new URL('/auth/signin', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
      }

      // La verifica del ruolo admin viene fatta nel layout client-side
      // Il middleware verifica solo che l'utente sia autenticato
      // Il layout si occuperà di verificare il ruolo e reindirizzare se necessario
    } catch (error) {
      console.error('Errore nel middleware admin:', error);
      const homeUrl = new URL('/', request.url);
      return NextResponse.redirect(homeUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};

