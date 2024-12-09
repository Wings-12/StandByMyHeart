import React from 'react';
import { EmotionLevelBar } from './EmotionLevelBar';
import { JournalEntry } from './JournalEntry';
import { ChatInterface } from './ChatInterface';

export const CoachingPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-8">
          <EmotionLevelBar />
          <JournalEntry />
        </div>
        <ChatInterface />
      </div>
    </div>
  );
};