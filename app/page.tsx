'use client';

import { useState, useEffect } from 'react';
import { EmotionLevelBar } from '@/components/EmotionLevelBar';
import { ChatInterface } from '@/components/ChatInterface';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/components/auth/AuthProvider';
import type { ChatMessage, AIConversation } from '@/lib/types';
import { AgumonAICoach } from '@/lib/ai-service';
import { 
  createConversation, 
  saveMessage, 
  getConversationHistory, 
  generateAndSaveConversationSummary,
  getUserConversations 
} from '@/lib/conversations';

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [currentConversation, setCurrentConversation] = useState<AIConversation | null>(null);
  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [emotionLevel, setEmotionLevel] = useState<number>(3);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  const loadConversations = async () => {
    if (!user?.id) return;
    try {
      const userConversations = await getUserConversations(user.id);
      setConversations(userConversations);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const startNewConversation = async () => {
    if (!user?.id) return;
    try {
      const newConversation = await createConversation(user.id);
      setCurrentConversation(newConversation);
      setMessages([]);
      setConversations(prev => [newConversation, ...prev]);
      
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        userId: 'ai',
        content: 'やあパートナー！アグモンだモン！今日はどんな気分だモン？何でも話してくれるモン！',
        type: 'ai',
        timestamp: new Date(),
        conversationId: newConversation.id
      };
      setMessages([welcomeMessage]);
    } catch (error) {
      toast({
        title: 'エラー',
        description: '新しい会話の開始に失敗しました。',
        variant: 'destructive',
      });
    }
  };

  const loadConversation = async (conversation: AIConversation) => {
    try {
      setCurrentConversation(conversation);
      const history = await getConversationHistory(conversation.id);
      setMessages(history);
    } catch (error) {
      toast({
        title: 'エラー',
        description: '会話の読み込みに失敗しました。',
        variant: 'destructive',
      });
    }
  };

  const handleEmotionLevelChange = (level: number) => {
    setEmotionLevel(level);
  };

  const handleSendMessage = async (content: string) => {
    if (!user?.id || !currentConversation) {
      await startNewConversation();
      return;
    }

    setIsLoading(true);

    try {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        userId: user.id,
        content,
        type: 'user',
        timestamp: new Date(),
        conversationId: currentConversation.id,
        metadata: { emotionLevel }
      };

      setMessages(prev => [...prev, userMessage]);
      await saveMessage(currentConversation.id, userMessage);

      const aiCoach = new AgumonAICoach();
      const aiResponse = await aiCoach.generateResponse(content, messages);

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        userId: 'ai',
        content: aiResponse.content,
        type: 'ai',
        timestamp: new Date(),
        conversationId: currentConversation.id,
        metadata: aiResponse.metadata
      };

      setMessages(prev => [...prev, aiMessage]);
      await saveMessage(currentConversation.id, aiMessage);

    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: 'エラー',
        description: 'メッセージの送信に失敗しました。',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!currentConversation || messages.length === 0) return;

    try {
      const { saveConversationSummaryToJournal } = await import('@/lib/journal-conversation-integration');
      await saveConversationSummaryToJournal(currentConversation.id, user!.id, emotionLevel);
      
      toast({
        title: '要約完了',
        description: '会話の要約を日記に保存しました。',
      });
      
      const summary = await generateAndSaveConversationSummary(currentConversation.id);
      setConversations(prev => 
        prev.map(conv => 
          conv.id === currentConversation.id 
            ? { ...conv, summary }
            : conv
        )
      );
    } catch (error) {
      toast({
        title: 'エラー',
        description: '要約の生成に失敗しました。',
        variant: 'destructive',
      });
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
  };

  if (!user) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>ログインしてAIコーチングを始めましょう。</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-center mb-8">AIコーチング</h1>
      
      <EmotionLevelBar onLevelChange={handleEmotionLevelChange} />

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">アグモンと話そう</h2>
          <div className="space-x-2">
            <Button onClick={startNewConversation} variant="outline">
              新しい会話
            </Button>
            {currentConversation && messages.length > 2 && (
              <Button onClick={handleGenerateSummary} variant="outline">
                要約を日記に保存
              </Button>
            )}
          </div>
        </div>
        
        {currentConversation ? (
          <ChatInterface
            onSendMessage={handleSendMessage}
            messages={messages}
            isRecording={isRecording}
            onStartRecording={handleStartRecording}
            onStopRecording={handleStopRecording}
          />
        ) : (
          <div className="text-center p-8">
            <p className="mb-4">アグモンと新しい会話を始めましょう！</p>
            <Button onClick={startNewConversation}>
              会話を開始
            </Button>
          </div>
        )}
      </Card>

      {conversations.length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">過去の会話</h2>
          <div className="space-y-2">
            {conversations.slice(0, 5).map((conversation) => (
              <div
                key={conversation.id}
                className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                onClick={() => loadConversation(conversation)}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{conversation.title}</h3>
                  <span className="text-sm text-gray-500">
                    {conversation.createdAt.toLocaleDateString('ja-JP')}
                  </span>
                </div>
                {conversation.summary && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {conversation.summary}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
