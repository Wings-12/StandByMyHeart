export type EmotionLevel = 1 | 2 | 3 | 4 | 5;

export interface JournalEntry {
  id: string;
  content: string;
  emotionLevel: EmotionLevel;
  timestamp: Date;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}