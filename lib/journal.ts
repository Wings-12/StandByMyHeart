import { supabase } from './supabase';
import type { JournalEntry, JournalSettings } from './types';

// ... 既存のコード ...

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

  if (error) throw error;
  return data?.journalSettings as JournalSettings;
}