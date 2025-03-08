'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/components/auth/AuthProvider';
import { getTemplates, createTemplate, deleteTemplate } from '@/lib/journal';
import { TemplateDialog } from '@/components/journal/TemplateDialog';
import { Trash2, Pencil } from 'lucide-react';
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
import type { JournalTemplate } from '@/lib/types';

export default function TemplateManagementPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<JournalTemplate[]>([]);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Omit<JournalTemplate, 'id' | 'userId'> | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadTemplates();
      setIsLoading(false);
    }
  }, [user]);

  const loadTemplates = async () => {
    if (!user) return;
    try {
      const templates = await getTemplates(user.id);
      setTemplates(templates);
    } catch (error) {
      toast({
        title: 'エラー',
        description: 'テンプレートの読み込みに失敗しました。',
        variant: 'destructive',
      });
    }
  };

  const handleBack = () => {
    router.push('/journal');
  };

  const handleSaveTemplate = async (template: Omit<JournalTemplate, 'id' | 'userId'>) => {
    if (!user) return;

    try {
      console.log('Current user:', user);
      console.log('Creating template with:', {
        ...template,
        userId: user.id,
      });

      const newTemplate = await createTemplate({
        ...template,
        userId: user.id,
      });

      // テンプレート一覧を更新
      setTemplates(prev => [...prev, newTemplate]);

      // 編集モードをリセット
      setEditingTemplate(undefined);

      return Promise.resolve();
    } catch (error) {
      toast({
        title: 'エラー',
        description: 'テンプレートの保存に失敗しました。',
        variant: 'destructive',
      });
      return Promise.reject(error);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!user) return;

    try {
      await deleteTemplate(id, user.id);

      // テンプレート一覧から削除
      setTemplates(prev => prev.filter(t => t.id !== id));

      toast({
        title: '削除完了',
        description: 'テンプレートを削除しました。',
      });
    } catch (error) {
      toast({
        title: 'エラー',
        description: 'テンプレートの削除に失敗しました。',
        variant: 'destructive',
      });
    }
  };

  const handleEditTemplate = (template: JournalTemplate) => {
    setEditingTemplate({
      title: template.title,
      content: template.content,
      tags: template.tags,
    });
    setIsTemplateDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-8">テンプレート管理</h1>

      <div className="space-y-6">
        <Card className="p-6">
          <div className="space-y-4">
            <Button
              variant="outline"
              onClick={() => {
                setEditingTemplate(undefined);
                setIsTemplateDialogOpen(true);
              }}
            >
              テンプレートを追加
            </Button>

            {templates.length > 0 ? (
              <div className="space-y-2">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{template.title}</h3>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditTemplate(template)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>テンプレートを削除しますか？</AlertDialogTitle>
                              <AlertDialogDescription>
                                この操作は取り消せません。本当にこのテンプレートを削除してもよろしいですか？
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>キャンセル</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteTemplate(template.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                削除する
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
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

        <Button onClick={handleBack} className="w-full">
          日記に戻る
        </Button>
      </div>

      <TemplateDialog
        open={isTemplateDialogOpen}
        onOpenChange={setIsTemplateDialogOpen}
        onSave={handleSaveTemplate}
        initialTemplate={editingTemplate}
      />
    </div>
  );
}
