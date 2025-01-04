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
  onSelectTemplate: (template: JournalTemplate) => void;
  onAddTemplate: () => void;
}

export function TemplateSelector({
  templates,
  onSelectTemplate,
  onAddTemplate,
}: TemplateSelectorProps) {
  return (
    <div className="flex gap-2 items-center">
      <Select
        onValueChange={(value) => {
          const template = templates.find((t) => t.id === value);
          if (template) {
            onSelectTemplate(template);
          }
        }}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="テンプレートを選択" />
        </SelectTrigger>
        <SelectContent>
          {templates.map((template) => (
            <SelectItem key={template.id} value={template.id}>
              {template.name}
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