import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip middleware for static files and public routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/public') ||
    pathname.startsWith('/auth') ||
    pathname === '/'
  ) {
    return NextResponse.next();
  }

  // For client-side Supabase authentication, let the ProtectedRoute component handle auth
  // The middleware should not block requests - let the client-side auth flow work
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - auth routes (login, callback, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|auth).*)',
  ],
};
