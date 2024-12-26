'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { updatePassword } from '@/lib/auth';
import { AuthError } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

export function UpdatePasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 6) {
      toast({
        title: 'エラー',
        description: 'パスワードは6文字以上で入力してください',
        variant: 'destructive',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'エラー',
        description: 'パスワードが一致しません',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await updatePassword(password);
      toast({
        title: '更新完了',
        description: 'パスワードが更新されました',
      });
      router.push('/');
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
      <h2 className="text-2xl font-bold text-center mb-6">新しいパスワードを設定</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="new-password" className="text-sm font-medium">
            新しいパスワード
          </label>
          <Input
            id="new-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            placeholder="6文字以上で入力"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="confirm-password" className="text-sm font-medium">
            パスワードの確認
          </label>
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            placeholder="パスワードを再入力"
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? '更新中...' : 'パスワードを更新'}
        </Button>
      </form>
    </Card>
  );
}