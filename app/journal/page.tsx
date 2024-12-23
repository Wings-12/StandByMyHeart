'use client';

import { useState, useEffect } from 'react';
import { JournalEditor } from '@/components/JournalEditor';
import { JournalEntryList } from '@/components/JournalEntryList';
import { saveJournalEntry, getJournalEntries } from '@/lib/journal';
import type { JournalEntry } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function getUser() {
      try {
        // テストユーザーでログイン
        const { data, error } = await supabase.auth.signInWithOtp({
          email: '',
          options: {
            emailRedirectTo: 'http://localhost:3000/journal'  // リダイレクト先URL
          }
        });

        if (error) {
          console.error('マジックリンク送信エラー:', error);
          return;
        }

        console.log('マジックリンクを送信しました。メールを確認してください。');

        // ログイン成功後にユーザーIDを設定
        setUserId(data.user.id);
        console.log('認証済みユーザーID:', data.user.id);
      } catch (error) {
        console.error('認証エラー:', error);
      }
    }
    getUser();
  }, []);

  useEffect(() => {
    loadEntries();
  }, [userId]);

  const loadEntries = async () => {
    if (!userId) return;
    try {
      const data = await getJournalEntries(userId);
      setEntries(data);
    } catch (error) {
      toast({
        title: 'エラー',
        description: '日記の読み込みに失敗しました。',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEntry = async (entry: Omit<JournalEntry, 'id' | 'userId'>) => {
    console.log('handleSaveEntryが呼ばれました')
    if (!userId) return; // ここでreturnされている
    console.log('try処理を行います')
    try {
      const newEntry = await saveJournalEntry({
        ...entry,
        userId: userId,
      });

      console.log('New Journal Entry:', newEntry);

      setEntries((prev) => [newEntry, ...prev]);

      toast({
        title: '保存完了',
        description: '日記を保存しました。',
      });
    } catch (error) {
      toast({
        title: 'エラー',
        description: '日記の保存に失敗しました。',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-center mb-8">ジャーナル</h1>

      <JournalEditor onSave={handleSaveEntry} />

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">過去の記録</h2>
        {isLoading ? (
          <div className="text-center p-4">読み込み中...</div>
        ) : (
          <JournalEntryList entries={entries} />
        )}
      </div>
    </div>
  );
}