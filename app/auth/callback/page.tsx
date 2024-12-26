'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const getRedirectURL = () => {
  const env = process.env.NODE_ENV;
  return env === 'development'
    ? 'http://localhost:3000/auth/callback'
    : 'https://stupendous-bunny-b18132.netlify.app/auth/callback';
}

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const redirectURL = getRedirectURL();

        // セッションの取得を試みる
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('認証エラー:', error.message);
          router.push('/auth');
          return;
        }

        if (session) {
          router.push('/journal');
        } else {
          router.push('/auth');
        }
      } catch (error) {
        console.error('コールバックエラー:', error);
        router.push('/auth');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">認証処理中...</h2>
        <p className="text-muted-foreground">しばらくお待ちください</p>
      </div>
    </div>
  );
}