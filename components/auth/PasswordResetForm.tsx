'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { resetPassword } from '@/lib/auth';
import { AuthError } from '@supabase/supabase-js';

export function PasswordResetForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: 'エラー',
        description: 'メールアドレスを入力してください',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(email);
      toast({
        title: 'メール送信完了',
        description: 'パスワードリセット用のメールを送信しました。メールをご確認ください。',
      });
      setEmail('');
    } catch (error) {
      toast({
        title: 'エラー',
        description: error instanceof AuthError ? error.message : 'エラーが発生しました。',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">パスワードをリセット</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="reset-email" className="text-sm font-medium">
            メールアドレス
          </label>
          <Input
            id="reset-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="example@example.com"
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? '送信中...' : 'リセットメールを送信'}
        </Button>
      </form>
    </Card>
  );
}