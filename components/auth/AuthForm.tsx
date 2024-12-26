'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { signIn, signUp } from '@/lib/auth';
import { AuthError } from '@supabase/supabase-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const validateForm = () => {
    if (!email || !password) {
      toast({
        title: 'エラー',
        description: 'メールアドレスとパスワードを入力してください',
        variant: 'destructive',
      });
      return false;
    }
    if (password.length < 6) {
      toast({
        title: 'エラー',
        description: 'パスワードは6文字以上で入力してください',
        variant: 'destructive',
      });
      return false;
    }
    return true;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (isSignUp) {
        const { user } = await signUp(email, password);
        if (user) {
          toast({
            title: '確認メール送信',
            description: 'アカウント登録のための確認メールを送信しました。メールを確認してアカウントを有効化してください。',
          });
          setIsSignUp(false);
        } else {
          toast({
            title: '確認メール送信',
            description: '確認メールを送信しました。メールを確認してアカウントを有効化してください。',
          });
        }
      } else {
        await signIn(email, password);
        toast({
          title: 'ログイン成功',
          description: 'ログインしました。',
        });
        router.push('/journal');
      }
    } catch (error) {
      const message = error instanceof AuthError
        ? error.message === 'Email not confirmed'
          ? 'メールアドレスが確認されていません。確認メールをご確認ください。'
          : error.message
        : '認証エラーが発生しました。';

      toast({
        title: 'エラー',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">
        {isSignUp ? 'アカウント登録' : 'ログイン'}
      </h2>
      <form onSubmit={handleAuth} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            メールアドレス
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="example@example.com"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            パスワード
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            placeholder="6文字以上で入力"
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? '処理中...' : isSignUp ? '登録する' : 'ログイン'}
        </Button>
      </form>
      <div className="mt-4 text-center space-y-2">
        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setEmail('');
            setPassword('');
          }}
          className="text-sm text-primary hover:underline block"
        >
          {isSignUp
            ? 'すでにアカウントをお持ちの方はこちら'
            : 'アカウントをお持ちでない方はこちら'}
        </button>
        {!isSignUp && (
          <Link
            href="/auth/reset-password"
            className="text-sm text-primary hover:underline block"
          >
            パスワードをお忘れの方はこちら
          </Link>
        )}
      </div>
    </Card>
  );
}