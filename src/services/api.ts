import type { JournalEntry } from '../types';

const API_URL = 'http://localhost:5000/api';

export const api = {
  async getJournalEntries(): Promise<JournalEntry[]> {
    const response = await fetch(`${API_URL}/journal-entries`);
    if (!response.ok) throw new Error('Failed to fetch journal entries');
    return response.json();
  },

  async createJournalEntry(data: { content: string; emotionLevel: number }): Promise<JournalEntry> {
    const response = await fetch(`${API_URL}/journal-entries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create journal entry');
    return response.json();
  },

  async updateJournalEntry(id: string, content: string): Promise<JournalEntry> {
    const response = await fetch(`${API_URL}/journal-entries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    if (!response.ok) throw new Error('Failed to update journal entry');
    return response.json();
  },

  async deleteJournalEntry(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/journal-entries/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete journal entry');
  },
};