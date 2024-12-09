'use client';

import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { JournalEntry } from '@/lib/types';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface JournalEntryListProps {
  entries: JournalEntry[];
}

export function JournalEntryList({ entries }: JournalEntryListProps) {
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

  return (
    <Card className="h-[600px]">
      <ScrollArea className="h-full p-6">
        {entries.map((entry) => (
          <div key={entry.id} className="mb-6 last:mb-0">
            <div className="flex items-center justify-between mb-2">
              <time className="text-sm text-muted-foreground">
                {format(new Date(entry.timestamp), 'PPP', { locale: ja })}
              </time>
              <span className="text-xl" title={`感情レベル: ${entry.emotionLevel}`}>
                {getEmotionLabel(entry.emotionLevel)}
              </span>
            </div>
            <Card className="p-4 bg-muted">
              <p className="whitespace-pre-wrap">{entry.content}</p>
            </Card>
          </div>
        ))}
      </ScrollArea>
    </Card>
  );
}