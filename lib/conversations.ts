import { supabase } from './supabase';
import type { ChatMessage, AIConversation } from './types';
import { AgumonAICoach } from './ai-service';

const mockConversations: AIConversation[] = [];
const mockMessages: ChatMessage[] = [];

function isDevelopmentMode(): boolean {
  return process.env.NODE_ENV === 'development' && 
         (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('dummy') ?? false);
}

export async function createConversation(userId: string, title?: string): Promise<AIConversation> {
  if (isDevelopmentMode()) {
    const mockConversation: AIConversation = {
      id: `mock-conv-${Date.now()}`,
      userId,
      title: title || `会話 ${new Date().toLocaleDateString('ja-JP')}`,
      summary: undefined,
      journalEntryId: undefined,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockConversations.push(mockConversation);
    return mockConversation;
  }
  const { data, error } = await supabase
    .from('ai_conversations')
    .insert({
      user_id: userId,
      title: title || `会話 ${new Date().toLocaleDateString('ja-JP')}`
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    userId: data.user_id,
    title: data.title,
    summary: data.summary,
    journalEntryId: data.journal_entry_id,
    isActive: data.is_active,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at)
  };
}

export async function saveMessage(conversationId: string, message: ChatMessage): Promise<void> {
  if (isDevelopmentMode()) {
    mockMessages.push({ ...message, conversationId });
    return;
  }
  const { error } = await supabase
    .from('ai_messages')
    .insert({
      conversation_id: conversationId,
      content: message.content,
      type: message.type,
      timestamp: message.timestamp.toISOString(),
      metadata: message.metadata || {}
    });

  if (error) throw error;
}

export async function getConversationHistory(conversationId: string): Promise<ChatMessage[]> {
  if (isDevelopmentMode()) {
    return mockMessages.filter(msg => msg.conversationId === conversationId);
  }
  const { data, error } = await supabase
    .from('ai_messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('timestamp', { ascending: true });

  if (error) throw error;

  return data.map(msg => ({
    id: msg.id,
    userId: '', // Will be filled from conversation data if needed
    content: msg.content,
    type: msg.type,
    timestamp: new Date(msg.timestamp),
    conversationId: msg.conversation_id,
    metadata: msg.metadata
  }));
}

export async function getUserConversations(userId: string): Promise<AIConversation[]> {
  if (isDevelopmentMode()) {
    return mockConversations.filter(conv => conv.userId === userId && conv.isActive);
  }
  const { data, error } = await supabase
    .from('ai_conversations')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('updated_at', { ascending: false });

  if (error) throw error;

  return data.map(conv => ({
    id: conv.id,
    userId: conv.user_id,
    title: conv.title,
    summary: conv.summary,
    journalEntryId: conv.journal_entry_id,
    isActive: conv.is_active,
    createdAt: new Date(conv.created_at),
    updatedAt: new Date(conv.updated_at)
  }));
}

export async function generateAndSaveConversationSummary(conversationId: string): Promise<string> {
  const messages = await getConversationHistory(conversationId);
  
  if (messages.length === 0) {
    throw new Error('No messages found in conversation');
  }

  const aiCoach = new AgumonAICoach();
  const summary = await aiCoach.generateConversationSummary(messages);

  if (isDevelopmentMode()) {
    const conversation = mockConversations.find(conv => conv.id === conversationId);
    if (conversation) {
      conversation.summary = summary;
    }
    return summary;
  }

  const { error } = await supabase
    .from('ai_conversations')
    .update({ summary })
    .eq('id', conversationId);

  if (error) throw error;

  return summary;
}

export async function linkConversationToJournal(conversationId: string, journalEntryId: string): Promise<void> {
  const { error } = await supabase
    .from('ai_conversations')
    .update({ journal_entry_id: journalEntryId })
    .eq('id', conversationId);

  if (error) throw error;
}

export async function updateConversationTitle(conversationId: string, title: string): Promise<void> {
  const { error } = await supabase
    .from('ai_conversations')
    .update({ title })
    .eq('id', conversationId);

  if (error) throw error;
}
