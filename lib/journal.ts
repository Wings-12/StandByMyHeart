import { supabase } from './supabase';
import type { JournalEntry } from './types';

export async function saveJournalEntry(entry: Omit<JournalEntry, 'id'>) {
  const { data, error } = await supabase
    .from('journal_entries')
    .insert([entry])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getJournalEntries(userId: string) {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('userId', userId)
    .order('timestamp', { ascending: false });

  if (error) throw error;
  return data;
}