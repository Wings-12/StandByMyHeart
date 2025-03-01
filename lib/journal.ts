/**
 * journal.ts
 *
 * 日記機能に関する主要な関数を提供するモジュール
 * Supabaseとの通信を行い、日記エントリーの作成、取得、更新、削除などの操作を実装
 */

import { supabase } from './supabase';
import type { JournalEntry, JournalSettings } from './types';

/**
 * 新しい日記エントリーを保存
 * @param entry - 保存する日記エントリー（IDは自動生成）
 * @returns 保存された日記エントリー
 */

export async function saveJournalEntry(entry: Omit<JournalEntry, 'id'>) {
  const { data, error } = await supabase
    .from('journal_entries')
    .insert(entry)
    .select() // すべてのカラムを取得
    .single(); // 今回insertしたエントリーのみを取得

  if (error) throw error;
  return data;
}

/**
 * 特定のユーザーのすべての日記エントリーを取得
 * @param userId - 取得する日記エントリーのユーザーID
 * @returns 日記エントリーのリスト
 */
export async function getJournalEntries(userId: string) {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('userId', userId)
    .order('timestamp', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * idとuserIdに一致する日記エントリーを削除
 * @param id
 * @param userId
 */
export async function deleteJournalEntry(id: string, userId: string) {
  const { error } = await supabase
    .from('journal_entries')
    .delete()
    .eq('id', id) // idが一致するエントリー
    .eq('userId', userId); // userIdが一致するエントリー

  if (error) throw error;
}

export async function updateJournalEntry(entry: JournalEntry) {
  const { data, error } = await supabase
    .from('journal_entries')
    .update({
      content: entry.content,
      emotionLevel: entry.emotionLevel,
      timestamp: entry.timestamp,
      tags: entry.tags,
    })
    .eq('id', entry.id)
    .eq('userId', entry.userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateJournalSettings(userId: string, settings: JournalSettings) {
  const { data, error } = await supabase
    .from('user_settings')
    .upsert({
      userId,
      journalSettings: settings,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getJournalSettings(userId: string) {
  const { data, error } = await supabase
    .from('user_settings')
    .select('journalSettings')
    .eq('userId', userId)
    .single();

  // データが存在しない場合（404エラー）は、デフォルト値を返す
  if (error?.code === 'PGRST116') {
    const defaultSettings: JournalSettings = {
      autoSave: false,
      reminderEnabled: false,
      templates: [],
    };
    return defaultSettings;
  }

  if (error) throw error;

  // データが存在するがjournalSettingsがnullの場合もデフォルト値を返す
  if (!data?.journalSettings) {
    return {
      autoSave: false,
      reminderEnabled: false,
      templates: [],
    };
  }

  return data.journalSettings as JournalSettings;
}
