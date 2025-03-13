/**
 * journal.ts
 *
 * 日記機能に関する主要な関数を提供するモジュール
 * Supabaseとの通信を行い、日記エントリーの作成、取得、更新、削除などの操作を実装
 */

import { supabase } from './supabase';
import type { JournalEntry, JournalSettings, BaseJournalTemplate, JournalTemplateWithId } from './types';

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
  console.log('Updating settings for user:', userId, 'with:', settings);
  const { data, error } = await supabase
    .from('user_settings')
    .upsert({
      userId: userId,
      journalSettings: settings,
    })
    .select()
    .single();

  console.log('Update result:', { data, error });

  if (error) throw error;
  return data;
}

export async function getJournalSettings(userId: string) {
  console.log('Getting settings for user:', userId);
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('userId', userId)
    .single();

  console.log('Settings query result:', { data, error });

  if (error?.code === 'PGRST116') {
    const defaultSettings: JournalSettings = {
      autoSave: false,
      reminderEnabled: false,
      templates: [],
    };
    return defaultSettings;
  }

  if (error) throw error;

  if (!data?.journalSettings) {
    return {
      autoSave: false,
      reminderEnabled: false,
      templates: [],
    };
  }

  return data.journalSettings as JournalSettings;
}

/**
 * テンプレート関連の関数
 */

/**
 * 新しいテンプレートを作成
 * @param template - 作成するテンプレート
 * @returns 作成されたテンプレート
 */
export async function createTemplate(template: Omit<BaseJournalTemplate, 'id'>) {
  try {
    // 入力パラメータの確認
    console.log('[createTemplate] Input template:', {
      template_data: {
        userId: template.userId,
        title: template.title,
        content_length: template.content?.length
      },
      validation: {
        userId_exists: !!template.userId,
        userId_type: typeof template.userId
      }
    });

    // データベースに送信するデータを準備
    // 必要なフィールドのみを送信
    const insertData = {
      user_id: template.userId,
      title: template.title,
      content: template.content
    };

    console.log('[createTemplate] Database operation:', {
      operation: 'INSERT',
      table: 'journal_templates',
      payload: insertData
    });

    // 1回のクエリでinsertとselect
    console.log('[createTemplate] Executing insert query with:', {
      table: 'journal_templates',
      insert_data: insertData
    });

    const { data, error } = await supabase
      .from('journal_templates')
      .insert(insertData)
      .select()  // saveJournalEntryと同じスタイル
      .single();

    console.log('[createTemplate] Query result:', {
      success: !error,
      error_details: error ? {
        code: error.code,
        message: error.message,
        details: error.details
      } : null,
      received_data: data ? {
        id: data.id,
        user_id: data.user_id,
        title: data.title
      } : null
    });

    // エラーが発生した場合
    if (error) {
      console.error('[createTemplate] Database error:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
        request_payload: insertData
      });
      throw error;
    }

    // データが返却されなかった場合
    if (!data) {
      console.error('[createTemplate] No data returned after insert');
      throw new Error('Template creation failed - no data returned');
    }

    // 成功時のレスポンスデータを確認
    console.log('[createTemplate] Success:', {
      received_data: {
        id: data.id,
        user_id: data.user_id,
        title: data.title,
        content_length: data.content?.length
      }
    });

    // フロントエンド用の形式に変換して返却
    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      content: data.content,
      tags: []
    };
  } catch (error) {
    console.error('[createTemplate] Error:', {
      error_type: error instanceof Error ? error.constructor.name : typeof error,
      message: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
}

/**
 * ユーザーのテンプレート一覧を取得
 * @param userId - ユーザーID
 * @returns テンプレートのリスト
 */
export async function getTemplates(userId: string) {
  const { data, error } = await supabase
    .from('journal_templates')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map(item => ({
    id: item.id,
    userId: item.user_id,
    title: item.title,
    content: item.content,
    tags: []
  }));
}

/**
 * テンプレートを更新
 * @param selectedTemplate - 更新するテンプレート
 * @returns 更新されたテンプレート
 */
export async function updateTemplate(selectedTemplate: JournalTemplateWithId) {
  const { data, error } = await supabase
    .from('journal_templates')
    .update({
      title: selectedTemplate.title,
      content: selectedTemplate.content
    })
    .eq('id', selectedTemplate.id)
    .eq('user_id', selectedTemplate.userId)
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    userId: data.user_id,
    title: data.title,
    content: data.content,
    tags: selectedTemplate.tags || []
  };
}

/**
 * テンプレートを削除
 * @param id - テンプレートID
 * @param userId - ユーザーID
 */
export async function deleteTemplate(id: string, userId: string) {
  const { error } = await supabase
    .from('journal_templates')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
}
