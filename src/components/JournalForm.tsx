import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useCoachingStore } from '../store/useCoachingStore';

interface JournalFormProps {
  className?: string;
}

export const JournalForm: React.FC<JournalFormProps> = ({ className = '' }) => {
  const [content, setContent] = useState('');
  const { currentEmotionLevel, addJournalEntry } = useCoachingStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    addJournalEntry({
      content,
      emotionLevel: currentEmotionLevel,
    });
    setContent('');
  };

  return (
    <div className={`w-full p-4 bg-white rounded-lg shadow-md ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Journal Your Thoughts</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-32 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="What's on your mind?"
        />
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Send size={18} />
          <span>Save Entry</span>
        </button>
      </form>
    </div>
  );
};