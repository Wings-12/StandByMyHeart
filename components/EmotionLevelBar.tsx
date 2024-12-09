'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';

interface EmotionLevelBarProps {
  onLevelChange: (level: number) => void;
}

export function EmotionLevelBar({ onLevelChange }: EmotionLevelBarProps) {
  const [level, setLevel] = useState(3);

  const handleChange = (value: number[]) => {
    setLevel(value[0]);
    onLevelChange(value[0]);
  };

  const getEmotionLabel = (level: number) => {
    switch (level) {
      case 1:
        return '落ち込んでいる';
      case 2:
        return '少し元気がない';
      case 3:
        return '普通';
      case 4:
        return '元気';
      case 5:
        return 'とても元気！';
      default:
        return '普通';
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-lg font-semibold">今の気分は？</h3>
      <div className="space-y-4">
        <Slider
          value={[level]}
          min={1}
          max={5}
          step={1}
          onValueChange={handleChange}
          className="w-full"
        />
        <p className="text-center text-muted-foreground">
          {getEmotionLabel(level)}
        </p>
      </div>
    </Card>
  );
}