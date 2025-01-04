'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/components/auth/AuthProvider';
import { updateJournalSettings, getJournalSettings } from '@/lib/journal';
import { TemplateDialog } from '@/components/journal/TemplateDialog';
import type { JournalSettings, JournalTemplate } from '@/lib/types';

export default function JournalSettingsPage() {
  const [settings, setSettings] = useState<JournalSettings>({
    autoSave: false,
    reminderEnabled: false,
    templates: [],
  });
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;
    try {
      const settings = await getJournalSettings(user.id);
      if (settings) {
        setSettings(settings);
      }
    } catch (error) {
      toast({
        title: 'エラー',
        description: '設定の読み込みに失敗しました。',
        variant: 'destructive',
      });
    }
  };

  const handleSaveSettings = async () => {
    if (!user) return;

    try {
      await updateJournalSettings(user.id, settings);
      toast({
        title: '設定を保存しました',
        description: '日記の設定を更新しました。',
      });
    } catch (error) {
      toast({
        title: 'エラー',
        description: '設定の保存に失敗しました。',
        variant: 'destructive',
      });
    }
  };

  const handleSaveTemplate = async (template: Omit<JournalTemplate, 'id' | 'userId'>) => {
    const newTemplate: JournalTemplate = {
      ...template,
      id: crypto.randomUUID(),
      userId: user?.id || '',
    };

    setSettings(prev => ({
      ...prev,
      templates: [...prev.templates, newTemplate],
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-8">日記の設定</h1>
      
      <div className="space-y-6">
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="auto-save">自動保存</Label>
              <p className="text-sm text-muted-foreground">
                入力中の内容を自動的に保存します
              </p>
            </div>
            <Switch
              id="auto-save"
              checked={settings.autoSave}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, autoSave: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="reminder">リマインダー</Label>
              <p className="text-sm text-muted-foreground">
                日記の記入時間になったら通知します
              </p>
            </div>
            <Switch
              id="reminder"
              checked={settings.reminderEnabled}
              onCheckedChange={(checked) =>
                setSettings(prev => ({ ...prev, reminderEnabled: checked }))
              }
            />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">テンプレート</h2>
          <div className="space-y-4">
            <Button
              variant="outline"
              onClick={() => setIsTemplateDialogOpen(true)}
            >
              テンプレートを追加
            </Button>
            
            {settings.templates.length > 0 ? (
              <div className="space-y-2">
                {settings.templates.map((template) => (
                  <div
                    key={template.id}
                    className="p-4 border rounded-lg"
                  >
                    <h3 className="font-medium">{template.name}</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {template.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                テンプレートがありません
              </p>
            )}
          </div>
        </Card>

        <Button onClick={handleSaveSettings} className="w-full">
          設定を保存
        </Button>
      </div>

      <TemplateDialog
        open={isTemplateDialogOpen}
        onOpenChange={setIsTemplateDialogOpen}
        onSave={handleSaveTemplate}
      />
    </div>
  );
}