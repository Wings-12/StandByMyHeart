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
 * ID を含まない、基本的な JournalTemplate の型
 */
export interface BaseJournalTemplate {
  userId: string;
  title: string;
  content: string;
  tags: string[];
}

/**
 * ID を含む JournalTemplate の型
 */
export interface JournalTemplateWithId extends BaseJournalTemplate {
  id: string;
}

/**
 * ユーザーごとの日記設定の型定義
 * Supabaseのuser_settingsテーブルのjournal_settingsカラムと対応
 */
export interface JournalSettings {
  templates: JournalTemplateWithId[];        // 日記テンプレートの配列
  defaultEmotionLevel?: number;        // デフォルトの感情レベル
  defaultTags?: string[];             // デフォルトのタグ
  autoSave: boolean;                  // 自動保存の有効/無効
  reminderEnabled: boolean;           // リマインダーの有効/無効
  reminderTime?: string;              // リマインダーの時刻（HH:mm形式）
}

/**
 * チャットメッセージの型定義
 */
export interface ChatMessage {
  id: string;
  userId: string;
  content: string;
  type: 'user' | 'ai';
  timestamp: Date;
  conversationId?: string;
  metadata?: Record<string, any>;
}

export interface AIConversation {
  id: string;
  userId: string;
  title?: string;
  summary?: string;
  journalEntryId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 感情レベルの型定義
 */
export enum EmotionLevel {
  VeryDown = 1,
  Down = 2,
  Neutral = 3,
  Upbeat = 4,
  VeryUpbeat = 5
}
