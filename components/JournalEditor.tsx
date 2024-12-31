'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { EmotionLevelBar } from '@/components/EmotionLevelBar';
import type { JournalEntry } from '@/lib/types';

interface JournalEditorProps {
  onSave: (entry: Omit<JournalEntry, 'id' | 'userId'>) => Promise<void>;
  initialEntry?: JournalEntry;
  onCancel?: () => void;
}

export function JournalEditor({ onSave, initialEntry, onCancel }: JournalEditorProps) {
  const [content, setContent] = useState('');
  const [emotionLevel, setEmotionLevel] = useState(3);
  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    if (initialEntry) {
      setContent(initialEntry.content);
      setEmotionLevel(initialEntry.emotionLevel);
      setDate(new Date(initialEntry.timestamp));
    }
  }, [initialEntry]);

  const handleSave = async () => {
    if (content.trim()) {
      await onSave({
        content,
        emotionLevel,
        timestamp: date,
        tags: [], // TODO: Implement tag functionality
      });
      if (!initialEntry) {
        setContent('');
        setEmotionLevel(3);
        setDate(new Date());
      }
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-4">
            {initialEntry ? '記録を編集' : '日記を書く'}
          </h3>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="今日はどんな一日でしたか？"
            className="min-h-[200px]"
          />
        </div>
        <div className="w-full md:w-72 space-y-6">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => date && setDate(date)}
            className="rounded-md border"
          />
          <EmotionLevelBar 
            onLevelChange={setEmotionLevel}
            initialLevel={emotionLevel}
          />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            キャンセル
          </Button>
        )}
        <Button onClick={handleSave}>
          {initialEntry ? '更新する' : '保存する'}
        </Button>
      </div>
    </Card>
  );
}