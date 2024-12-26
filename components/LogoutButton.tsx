'use client';

import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { signOut } from '@/lib/auth';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

export function LogoutButton() {
  const { toast } = useToast();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: 'ログアウト完了',
        description: 'ログアウトしました。',
      });
      router.push('/auth');
    } catch (error) {
      toast({
        title: 'エラー',
        description: 'ログアウトに失敗しました。',
        variant: 'destructive',
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      className="gap-2"
    >
      <LogOut className="h-4 w-4" />
      ログアウト
    </Button>
  );
}