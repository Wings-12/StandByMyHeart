'use client';

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import type { JournalTemplate } from "@/lib/types";

interface TemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (template: Omit<JournalTemplate, 'id' | 'userId'>) => Promise<void>;
  initialTemplate?: Omit<JournalTemplate, 'id' | 'userId'>;
}

export function TemplateDialog({
  open,
  onOpenChange,
  onSave,
  initialTemplate,
}: TemplateDialogProps) {
  const [title, setTitle] = useState(initialTemplate?.title || '');
  const [content, setContent] = useState(initialTemplate?.content || '');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // ダイアログが開かれたときに初期値をセット
  const handleOpenChange = (open: boolean) => {
    if (open && initialTemplate) {
      setTitle(initialTemplate.title);
      setContent(initialTemplate.content);
    } else if (!open) {
      // ダイアログが閉じられるときに値をリセット
      setTitle(initialTemplate?.title || '');
      setContent(initialTemplate?.content || '');
    }
    onOpenChange(open);
  };

  const validateForm = () => {
    if (!title.trim()) {
      toast({
        title: "エラー",
        description: "テンプレート名を入力してください",
        variant: "destructive",
      });
      return false;
    }
    if (!content.trim()) {
      toast({
        title: "エラー",
        description: "テンプレート内容を入力してください",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await onSave({
        title,
        content,
        tags: [],
      });
      
      // 保存成功後、フォームをリセット
      setTitle('');
      setContent('');
      
      toast({
        title: "保存完了",
        description: "テンプレートを保存しました",
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "エラー",
        description: "テンプレートの保存に失敗しました",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialTemplate ? "テンプレートを編集" : "テンプレートを追加"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">テンプレート名</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="朝の日記"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">テンプレート内容</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="1. 今日の目標&#13;&#10;2. 昨日できなかったこと&#13;&#10;3. 今の気持ち"
              className="min-h-[150px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "保存中..." : "保存"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}