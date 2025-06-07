import { supabase } from './supabase';
import { saveJournalEntry } from './journal';
import { generateAndSaveConversationSummary } from './conversations';
import type { JournalEntry } from './types';

const mockJournalEntries: JournalEntry[] = [];

function isDevelopmentMode(): boolean {
  return process.env.NODE_ENV === 'development' && 
         (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('dummy') ?? false);
}

export async function saveConversationSummaryToJournal(
  conversationId: string, 
  userId: string, 
  emotionLevel: number = 3
): Promise<JournalEntry> {
  const summary = await generateAndSaveConversationSummary(conversationId);
  
  if (isDevelopmentMode()) {
    const mockJournalEntry: JournalEntry = {
      id: `mock-journal-${Date.now()}`,
      userId,
      content: `【AIコーチング要約】\n\n${summary}`,
      emotionLevel,
      timestamp: new Date(),
      tags: ['AIコーチング', 'アグモン']
    };
    mockJournalEntries.push(mockJournalEntry);
    return mockJournalEntry;
  }

  const journalEntry = await saveJournalEntry({
    userId,
    content: `【AIコーチング要約】\n\n${summary}`,
    emotionLevel,
    timestamp: new Date(),
    tags: ['AIコーチング', 'アグモン']
  });

  const { error } = await supabase
    .from('ai_conversations')
    .update({ journal_entry_id: journalEntry.id })
    .eq('id', conversationId);

  if (error) {
    console.error('Failed to link conversation to journal:', error);
  }

  return journalEntry;
}

export async function getConversationsLinkedToJournal(journalEntryId: string) {
  const { data, error } = await supabase
    .from('ai_conversations')
    .select('*')
    .eq('journal_entry_id', journalEntryId);

  if (error) throw error;
  return data;
}
