// ... 既存のコード ...

export interface JournalTemplate {
  id: string;
  name: string;
  content: string;
  userId: string;
}

export interface JournalSettings {
  autoSave: boolean;
  reminderEnabled: boolean;
  templates: JournalTemplate[];
}