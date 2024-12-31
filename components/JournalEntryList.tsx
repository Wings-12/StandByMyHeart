'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { JournalEntry } from '@/lib/types';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Trash2, Edit2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { deleteJournalEntry, updateJournalEntry } from '@/lib/journal';
import { useAuth } from '@/components/auth/AuthProvider';
import { InlineEditor } from '@/components/InlineEditor';

interface JournalEntryListProps {
  entries: JournalEntry[];
  onDelete?: (id: string) => void;
  onUpdate?: (entry: JournalEntry) => void;
}

export function JournalEntryList({ entries, onDelete, onUpdate }: JournalEntryListProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [editingId, setEditingId] = useState<string | null>(null);

  const getEmotionLabel = (level: number) => {
    switch (level) {
      case 1: return '😢';
      case 2: return '😕';
      case 3: return '😊';
      case 4: return '😄';
      case 5: return '🤗';
      default: return '😊';
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;

    try {
      await deleteJournalEntry(id, user.id);
      onDelete?.(id);
      toast({
        title: '削除完了',
        description: '記録を削除しました。',
      });
    } catch (error) {
      toast({
        title: 'エラー',
        description: '削除に失敗しました。',
        variant: 'destructive',
      });
    }
  };

  const handleUpdate = async (entry: JournalEntry, newContent: string) => {
    if (!user) return;

    try {
      const updatedEntry = await updateJournalEntry({
        ...entry,
        content: newContent,
      });
      onUpdate?.(updatedEntry);
      setEditingId(null);
      toast({
        title: '更新完了',
        description: '記録を更新しました。',
      });
    } catch (error) {
      toast({
        title: 'エラー',
        description: '更新に失敗しました。',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="h-[600px]">
      <ScrollArea className="h-full p-6">
        {entries.map((entry) => (
          <div key={entry.id} className="mb-6 last:mb-0">
            <div className="flex items-center justify-between mb-2">
              <time className="text-sm text-muted-foreground">
                {format(new Date(entry.timestamp), 'PPP (E) HH:mm', { locale: ja })}
              </time>
              <div className="flex items-center gap-2">
                <span className="text-xl" title={`感情レベル: ${entry.emotionLevel}`}>
                  {getEmotionLabel(entry.emotionLevel)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setEditingId(entry.id)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>記録を削除しますか？</AlertDialogTitle>
                      <AlertDialogDescription>
                        この操作は取り消せません。本当にこの記録を削除してもよろしいですか？
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>キャンセル</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(entry.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        削除する
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            <Card className="p-4 bg-muted">
              {editingId === entry.id ? (
                <InlineEditor
                  initialValue={entry.content}
                  onSave={(newContent) => handleUpdate(entry, newContent)}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <p className="whitespace-pre-wrap">{entry.content}</p>
              )}
            </Card>
          </div>
        ))}
      </ScrollArea>
    </Card>
  );
}