import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // ジャーナルページは認証が必要
  if (req.nextUrl.pathname.startsWith('/journal') && !session) {
    return NextResponse.redirect(new URL('/auth', req.url));
  }

  // 認証済みユーザーがauth pageにアクセスした場合はホームにリダイレクト
  if (req.nextUrl.pathname.startsWith('/auth') && session) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/journal/:path*', '/auth'],
};