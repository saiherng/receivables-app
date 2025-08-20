import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    try {
      // Create a server-side client for this specific operation
      const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      });

      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Auth callback error:', error);
        return NextResponse.redirect(`${origin}/auth/login?error=${encodeURIComponent(error.message)}`);
      }

      if (data.user) {
        return NextResponse.redirect(`${origin}${next}`);
      }
    } catch (error: any) {
      console.error('Auth callback exception:', error);
      return NextResponse.redirect(`${origin}/auth/login?error=${encodeURIComponent('Authentication failed')}`);
    }
  }

  // If no code or error occurred, redirect to login
  return NextResponse.redirect(`${origin}/auth/login`);
}
