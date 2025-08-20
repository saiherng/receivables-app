import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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

  // Create Supabase client for server-side auth check
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables');
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Get the authorization header
    const authHeader = req.headers.get('authorization');
    const cookieHeader = req.headers.get('cookie');

    if (!authHeader && !cookieHeader) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    // Verify the session
    const { data: { user }, error } = await supabase.auth.getUser(
      authHeader?.replace('Bearer ', '') || undefined
    );

    if (error || !user) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    // Allow the request to proceed
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware authentication error:', error);
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
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
