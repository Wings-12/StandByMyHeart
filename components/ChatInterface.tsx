'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mic, Send } from 'lucide-react';
import { ChatMessage } from '@/lib/types';

interface ChatInterfaceProps {
  onSendMessage: (message: string) => Promise<void>;
  messages: ChatMessage[];
  isRecording?: boolean;
  onStartRecording?: () => void;
  onStopRecording?: () => void;
}

export function ChatInterface({
  onSendMessage,
  messages,
  isRecording,
  onStartRecording,
  onStopRecording,
}: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (input.trim()) {
      await onSendMessage(input);
      setInput('');
    }
  };

  return (
    <Card className="flex flex-col h-[600px]">
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.type === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block p-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </ScrollArea>
      <div className="p-4 border-t flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="メッセージを入力..."
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button onClick={handleSend}>
          <Send className="h-4 w-4" />
        </Button>
        {onStartRecording && onStopRecording && (
          <Button
            variant="outline"
            onClick={isRecording ? onStopRecording : onStartRecording}
          >
            <Mic className={`h-4 w-4 ${isRecording ? 'text-red-500' : ''}`} />
          </Button>
        )}
      </div>
    </Card>
  );
}