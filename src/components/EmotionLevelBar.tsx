import React from 'react';
import { Smile, Meh, Frown } from 'lucide-react';
import { useCoachingStore } from '../store/useCoachingStore';
import type { EmotionLevel } from '../types';

export const EmotionLevelBar: React.FC = () => {
  const { currentEmotionLevel, setEmotionLevel } = useCoachingStore();

  const handleLevelChange = (level: EmotionLevel) => {
    setEmotionLevel(level);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">How are you feeling?</h3>
      <div className="flex items-center justify-between mb-2">
        <Frown className="text-gray-500" />
        <Meh className="text-gray-500" />
        <Smile className="text-gray-500" />
      </div>
      <div className="flex gap-2">
        {([1, 2, 3, 4, 5] as const).map((level) => (
          <button
            key={level}
            onClick={() => handleLevelChange(level)}
            className={`flex-1 h-8 rounded ${
              currentEmotionLevel === level
                ? 'bg-blue-500'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
            aria-label={`Emotion Level ${level}`}
          />
        ))}
      </div>
      <p className="mt-2 text-sm text-gray-600 text-center">
        {currentEmotionLevel === 1 && "I'm feeling down"}
        {currentEmotionLevel === 2 && "I'm not feeling great"}
        {currentEmotionLevel === 3 && "I'm feeling okay"}
        {currentEmotionLevel === 4 && "I'm feeling good"}
        {currentEmotionLevel === 5 && "I'm feeling fantastic!"}
      </p>
    </div>
  );
};