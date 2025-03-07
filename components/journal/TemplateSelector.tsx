'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { JournalTemplate } from "@/lib/types";

interface TemplateSelectorProps {
  templates: JournalTemplate[];
  selectedTemplateId?: string;
  onSelectTemplate: (template: JournalTemplate) => void;
  onAddTemplate: () => void;
}

export function TemplateSelector({
  templates,
  selectedTemplateId,
  onSelectTemplate,
  onAddTemplate,
}: TemplateSelectorProps) {
  // テンプレート選択時の処理
  const handleValueChange = (value: string) => {

    // 選択されたテンプレートを探して適用
    const template = templates.find(t => t.id === value);
    if (template) {
      onSelectTemplate(template);
    }
  };

  // ドロップダウンの開閉時の処理
  const handleOpenChange = (open: boolean) => {

    // ドロップダウンが閉じた時に現在選択中のテンプレートを再適用
    if (!open && selectedTemplateId) {
      const template = templates.find(t => t.id === selectedTemplateId);
      if (template) {
        onSelectTemplate(template);
      }
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <Select
        value={selectedTemplateId}
        onValueChange={handleValueChange}
        onOpenChange={handleOpenChange}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="テンプレートを選択" />
        </SelectTrigger>
        <SelectContent>
          {templates.map((template) => (
            <SelectItem key={template.id} value={template.id}>
              {template.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        size="icon"
        onClick={onAddTemplate}
        title="新しいテンプレートを追加"
      >
        <PlusCircle className="h-4 w-4" />
      </Button>
    </div>
  );
}
