import { create } from 'zustand';
import type { EmotionLevel, JournalEntry, ChatMessage } from '../types';
import { api } from '../services/api';

interface CoachingStore {
  currentEmotionLevel: EmotionLevel;
  journalEntries: JournalEntry[];
  chatHistory: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  setEmotionLevel: (level: EmotionLevel) => void;
  fetchJournalEntries: () => Promise<void>;
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'timestamp'>) => Promise<void>;
  updateJournalEntry: (id: string, content: string) => Promise<void>;
  deleteJournalEntry: (id: string) => Promise<void>;
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
}

export const useCoachingStore = create<CoachingStore>((set, get) => ({
  currentEmotionLevel: 3,
  journalEntries: [],
  chatHistory: [],
  isLoading: false,
  error: null,
  
  setEmotionLevel: (level) => set({ currentEmotionLevel: level }),
  
  fetchJournalEntries: async () => {
    set({ isLoading: true, error: null });
    try {
      const entries = await api.getJournalEntries();
      set({ journalEntries: entries });
    } catch (error) {
      set({ error: 'Failed to fetch journal entries' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  addJournalEntry: async (entry) => {
    set({ isLoading: true, error: null });
    try {
      const newEntry = await api.createJournalEntry(entry);
      set((state) => ({
        journalEntries: [...state.journalEntries, newEntry],
      }));
    } catch (error) {
      set({ error: 'Failed to create journal entry' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateJournalEntry: async (id, content) => {
    set({ isLoading: true, error: null });
    try {
      const updatedEntry = await api.updateJournalEntry(id, content);
      set((state) => ({
        journalEntries: state.journalEntries.map((entry) =>
          entry.id === id ? updatedEntry : entry
        ),
      }));
    } catch (error) {
      set({ error: 'Failed to update journal entry' });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteJournalEntry: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.deleteJournalEntry(id);
      set((state) => ({
        journalEntries: state.journalEntries.filter((entry) => entry.id !== id),
      }));
    } catch (error) {
      set({ error: 'Failed to delete journal entry' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  addChatMessage: (message) => set((state) => ({
    chatHistory: [...state.chatHistory, {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      ...message,
    }],
  })),
}));