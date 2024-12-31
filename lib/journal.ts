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

export async function getJournalEntries(userId: string) {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('userId', userId)
    .order('timestamp', { ascending: false });

  if (error) throw error;
  return data;
}

export async function deleteJournalEntry(id: string, userId: string) {
  const { error } = await supabase
    .from('journal_entries')
    .delete()
    .match({ id, userId });

  if (error) throw error;
}