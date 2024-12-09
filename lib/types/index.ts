export interface EmotionLevel {
  level: 1 | 2 | 3 | 4 | 5;
  timestamp: Date;
  context?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  preferences: {
    interests: string[];
    communicationStyle: string;
    goals: string[];
  };
  emotionHistory: EmotionLevel[];
}

export interface ChatMessage {
  id: string;
  userId: string;
  content: string;
  type: 'user' | 'ai';
  timestamp: Date;
  emotionAnalysis?: {
    sentiment: number;
    emotions: string[];
  };
}

export interface JournalEntry {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
  emotionLevel: number;
  tags: string[];
  analysis?: {
    limitingBeliefs: string[];
    suggestedEmpoweringBeliefs: string[];
  };
}