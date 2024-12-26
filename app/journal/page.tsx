'use client';

import { useState, useEffect } from 'react';
import { JournalEditor } from '@/components/JournalEditor';
import { JournalEntryList } from '@/components/JournalEntryList';
import { saveJournalEntry, getJournalEntries } from '@/lib/journal';
import type { JournalEntry } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/components/auth/AuthProvider';

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadEntries();
    }
  }, [user]);

  const loadEntries = async () => {
    if (!user?.id) return;
    try {
      const data = await getJournalEntries(user.id);
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
    if (!user?.id) return;
    try {
      const newEntry = await saveJournalEntry({
        ...entry,
        userId: user.id,
      });

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

  const handleDeleteEntry = (id: string) => {
    setEntries((prev) => prev.filter(entry => entry.id !== id));
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-center mb-8">ジャーナル</h1>

      <JournalEditor onSave={handleSaveEntry} />

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">過去の記録</h2>
        {isLoading ? (
          <div className="text-center p-4">読み込み中...</div>
        ) : (
          <JournalEntryList entries={entries} onDelete={handleDeleteEntry} />
        )}
      </div>
    </div>
  );
}