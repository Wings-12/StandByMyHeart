'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { EmotionLevelBar } from '@/components/EmotionLevelBar';
import { TemplateSelector } from '@/components/journal/TemplateSelector';
import { TemplateDialog } from '@/components/journal/TemplateDialog';
import { useAuth } from '@/components/auth/AuthProvider';
import { getJournalSettings } from '@/lib/journal';
import type { JournalEntry, JournalTemplate } from '@/lib/types';

interface JournalEditorProps {
  onSave: (entry: Omit<JournalEntry, 'id' | 'userId'>) => Promise<void>;
  initialEntry?: JournalEntry;
  onCancel?: () => void;
}

export function JournalEditor({ onSave, initialEntry, onCancel }: JournalEditorProps) {
  const [content, setContent] = useState('');
  const [emotionLevel, setEmotionLevel] = useState(3);
  const [date, setDate] = useState<Date>(new Date());
  const [templates, setTemplates] = useState<JournalTemplate[]>([]);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (initialEntry) {
      setContent(initialEntry.content);
      setEmotionLevel(initialEntry.emotionLevel);
      setDate(new Date(initialEntry.timestamp));
    }
  }, [initialEntry]);

  useEffect(() => {
    if (user) {
      loadTemplates();
    }
  }, [user]);

  const loadTemplates = async () => {
    if (!user) return;
    try {
      const settings = await getJournalSettings(user.id);
      if (settings?.templates) {
        setTemplates(settings.templates);
      }
    } catch (error) {
      console.error('テンプレートの読み込みに失敗しました:', error);
    }
  };

  const handleSave = async () => {
    if (content.trim()) {
      await onSave({
        content,
        emotionLevel,
        timestamp: date,
        tags: [],
      });
      if (!initialEntry) {
        setContent('');
        setEmotionLevel(3);
        setDate(new Date());
      }
    }
  };

  const handleSelectTemplate = (template: JournalTemplate) => {
    setContent(prev => {
      // 既存の内容があれば、テンプレートを追加
      if (prev.trim()) {
        return `${prev}\n\n${template.content}`;
      }
      // 内容が空の場合は、テンプレートをそのまま設定
      return template.content;
    });
  };

  const handleSaveTemplate = async (template: Omit<JournalTemplate, 'id' | 'userId'>) => {
    if (!user) return;
    
    const newTemplate: JournalTemplate = {
      ...template,
      id: crypto.randomUUID(),
      userId: user.id,
    };

    setTemplates(prev => [...prev, newTemplate]);
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {initialEntry ? '記録を編集' : '日記を書く'}
            </h3>
            <TemplateSelector
              templates={templates}
              onSelectTemplate={handleSelectTemplate}
              onAddTemplate={() => setIsTemplateDialogOpen(true)}
            />
          </div>
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

      <TemplateDialog
        open={isTemplateDialogOpen}
        onOpenChange={setIsTemplateDialogOpen}
        onSave={handleSaveTemplate}
      />
    </Card>
  );
}