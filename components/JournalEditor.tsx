'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { EmotionLevelBar } from '@/components/EmotionLevelBar';
import { TemplateSelector } from '@/components/journal/TemplateSelector';
import { useAuth } from '@/components/auth/AuthProvider';
import { getTemplates } from '@/lib/journal';
import type { JournalEntry, JournalTemplate } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';

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
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>();
  const { user } = useAuth();
  const { toast } = useToast();

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
      const templates = await getTemplates(user.id);
      setTemplates(templates);
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

  // contentの変更を監視
  useEffect(() => {
    const currentTemplate = templates.find(t => t.id === selectedTemplateId);

    // 状態の整合性チェック
    if (currentTemplate && content !== currentTemplate.content) {
      console.log('警告：選択中テンプレートとcontentの内容が一致しません');
    }
  }, [content, selectedTemplateId, templates]);

  // テンプレート選択時の状態変更を監視
  useEffect(() => {
    console.log('テンプレート選択状態変更:', {
      テンプレートID: selectedTemplateId,
      現在のcontent: content
    });
  }, [selectedTemplateId]);

  const handleSelectTemplate = (template: JournalTemplate) => {
    // 1. テンプレート選択状態を更新
    setSelectedTemplateId(template.id);
    setContent(template.content);
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
              selectedTemplateId={selectedTemplateId}
              onSelectTemplate={handleSelectTemplate}
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

    </Card>
  );
}
