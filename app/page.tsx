'use client';

import { useState } from 'react';
import { EmotionLevelBar } from '@/components/EmotionLevelBar';
import { ChatInterface } from '@/components/ChatInterface';
import { Card } from '@/components/ui/card';
import type { ChatMessage } from '@/lib/types';

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  const handleEmotionLevelChange = (level: number) => {
    // Handle emotion level change
    console.log('Emotion level:', level);
  };

  const handleSendMessage = async (content: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: 'user-1', // Replace with actual user ID
      content,
      type: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);

    // Add AI response (replace with actual AI integration)
    const aiResponse: ChatMessage = {
      id: (Date.now() + 1).toString(),
      userId: 'ai',
      content: '申し訳ありません。現在AIレスポンスを実装中です。',
      type: 'ai',
      timestamp: new Date(),
    };

    setTimeout(() => {
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    // Implement voice recording logic
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // Implement voice recording stop logic
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center mb-8">AIコーチング</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            isRecording={isRecording}
            onStartRecording={handleStartRecording}
            onStopRecording={handleStopRecording}
          />
        </Card>

        <div className="space-y-4">
          <EmotionLevelBar onLevelChange={handleEmotionLevelChange} />
        </div>
      </div>
    </div>
  );
}