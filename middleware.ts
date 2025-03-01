/**
 * middleware.ts
 *
 * Next.jsのミドルウェア
 * リクエストごとにSupabaseのセッション管理を行い、認証状態を維持
 *
 * このミドルウェアは以下の役割を担います：
 * 1. リクエストごとにセッションを確認
 * 2. 必要に応じてセッションを更新
 * 3. クライアントとサーバー間の認証状態を同期
 */

import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // 次のレスポンスを作成
  const res = NextResponse.next();

  // Supabaseクライアントを初期化
  // このクライアントはミドルウェア専用で、リクエストとレスポンスの情報を使用
  const supabase = createMiddlewareClient({ req: request, res });

  // セッションの更新
  // 必要に応じて自動的にリフレッシュトークンを使用
  await supabase.auth.getSession();

  return res;
}
