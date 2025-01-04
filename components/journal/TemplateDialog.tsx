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
import type { JournalTemplate } from "@/lib/types";

interface TemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (template: Omit<JournalTemplate, 'id' | 'userId'>) => Promise<void>;
}

export function TemplateDialog({
  open,
  onOpenChange,
  onSave,
}: TemplateDialogProps) {
  const [name, setName] = useState('');
  const [content, setContent] = useState('');

  const handleSave = async () => {
    if (name.trim() && content.trim()) {
      await onSave({ name, content });
      setName('');
      setContent('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>テンプレートを追加</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">テンプレート名</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
          <Button onClick={handleSave}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}