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
  templates?: JournalTemplate[];
  defaultEmotionLevel?: number;
  autoSaveInterval?: number;
  defaultTags?: string[];
}
