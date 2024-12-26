'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
    const router = useRouter();

    useEffect(() => {
      // デバッグ用のログを追加
      console.log('AuthCallbackPage mounted');

      supabase.auth.onAuthStateChange((event, session) => {
        console.log('Auth state changed:', event, session); // 認証状態の変更を確認

        if (event === 'SIGNED_IN') {
          console.log('Redirecting to /journal'); // リダイレクト前のログ
          router.push('/journal');
        }
      });

      // 現在のセッション状態を確認
      const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Current session:', session);
      };
      checkSession();
    }, [router]);

    return <div>認証処理中...</div>;
  }