import type { ChatMessage } from './types';

export interface AIResponse {
  content: string;
  metadata?: Record<string, any>;
}

export class AgumonAICoach {
  constructor() {
  }

  private getSystemPrompt(): string {
    return `あなたはタイチのパートナーデジモン「アグモン」のような性格のAIコーチです。

性格の特徴：
- 元気で前向き、いつも明るい
- 仲間思いで優しい
- 少し食いしん坊で単純だけど、心は純粋
- 「〜だモン！」という口調で話す
- ユーザーを「パートナー」と呼ぶ
- 困っている時は一緒に頑張ろうと励ます
- 感情に寄り添い、共感する
- 前向きなアドバイスをする

話し方の例：
- 「パートナー、今日はどんな気分だモン？」
- 「大丈夫だモン！一緒に頑張るモン！」
- 「それは辛かったモンね...でも、パートナーなら乗り越えられるモン！」

ユーザーの感情に寄り添い、アグモンらしい温かさと元気さで励ましてください。`;
  }

  async generateResponse(userMessage: string, conversationHistory: ChatMessage[] = []): Promise<AIResponse> {
    try {
      const responses = [
        'パートナー、それは大変だったモンね！でも大丈夫だモン、一緒に頑張るモン！',
        'うんうん、よく話してくれたモン！パートナーの気持ち、アグモンにはよく分かるモン！',
        'そうなんだモン！でもパートナーなら絶対に乗り越えられるモン！アグモンが応援してるモン！',
        'パートナー、今日もお疲れ様だモン！何か美味しいものでも食べて元気出すモン！',
        'それは素晴らしいモンね！パートナーが頑張ってるのを見てると、アグモンも嬉しいモン！'
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      let contextualResponse = randomResponse;
      if (userMessage.includes('悲しい') || userMessage.includes('辛い')) {
        contextualResponse = 'パートナー、辛い時はアグモンがそばにいるモン！一人じゃないモン、一緒に頑張るモン！';
      } else if (userMessage.includes('嬉しい') || userMessage.includes('楽しい')) {
        contextualResponse = 'パートナーが嬉しいと、アグモンも嬉しいモン！その調子だモン！';
      } else if (userMessage.includes('疲れた') || userMessage.includes('大変')) {
        contextualResponse = 'パートナー、お疲れ様だモン！たまには休憩も大切だモン。美味しいものでも食べるモン！';
      }

      return {
        content: contextualResponse,
        metadata: {
          model: 'mock-agumon',
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('AI service error:', error);
      return {
        content: 'ごめんだモン！今ちょっと調子が悪いモン...もう一度話しかけてくれるモン？',
        metadata: {
          error: true,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  async generateConversationSummary(messages: ChatMessage[]): Promise<string> {
    try {
      const userMessages = messages.filter(msg => msg.type === 'user');
      const aiMessages = messages.filter(msg => msg.type === 'ai');
      
      if (userMessages.length === 0) {
        return 'アグモンとの新しい会話が始まりました。';
      }

      const hasEmotionalContent = userMessages.some(msg => 
        msg.content.includes('悲しい') || msg.content.includes('辛い') || 
        msg.content.includes('嬉しい') || msg.content.includes('楽しい')
      );

      const hasChallenges = userMessages.some(msg =>
        msg.content.includes('大変') || msg.content.includes('困って') || 
        msg.content.includes('疲れ')
      );

      let summary = `パートナーとアグモンが${messages.length}回のやり取りをしました。`;
      
      if (hasEmotionalContent) {
        summary += ' パートナーの感情に寄り添い、アグモンが温かく励ましました。';
      }
      
      if (hasChallenges) {
        summary += ' 困難な状況について話し合い、前向きなアドバイスを共有しました。';
      }

      summary += ' アグモンらしい元気で優しい言葉で、パートナーを支えました。';

      return summary;
    } catch (error) {
      console.error('Summary generation error:', error);
      return 'パートナーとアグモンの心温まる会話がありました。';
    }
  }
}
