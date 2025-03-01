/**
 * types.ts
 *
 * アプリケーション全体で使用する型定義
 * 日記機能に関連する型を定義
 */

/**
 * 日記エントリーの型定義
 * Supabaseのjournal_entriesテーブルと対応
 */
export interface JournalEntry {
  id: string;
  userId: string;
  content: string;
  emotionLevel: number;
  timestamp: Date;
  tags: string[];
}

/**
 * 日記テンプレートの型定義
 * 日記作成時に使用できるテンプレート
 */
export interface JournalTemplate {
  id: string;
  userId: string;
  title: string;
  content: string;
  tags: string[];
}

/**
 * ユーザーごとの日記設定の型定義
 * Supabaseのuser_settingsテーブルのjournal_settingsカラムと対応
 */
export interface JournalSettings {
  templates: JournalTemplate[];        // 日記テンプレートの配列
  defaultEmotionLevel?: number;        // デフォルトの感情レベル
  defaultTags?: string[];             // デフォルトのタグ
  autoSave: boolean;                  // 自動保存の有効/無効
  reminderEnabled: boolean;           // リマインダーの有効/無効
  reminderTime?: string;              // リマインダーの時刻（HH:mm形式）
}
