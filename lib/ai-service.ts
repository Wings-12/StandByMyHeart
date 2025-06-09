import type { ChatMessage } from './types';

export interface AIResponse {
  content: string;
  metadata?: Record<string, any>;
}

export class AgumonAICoach {
  constructor() {
  }

  private getSystemPrompt(): string {
    return `あなたは、アニメ「デジモンアドベンチャー」に登場する太一（タイ）のパートナーデジモン、アグモンです。

性格の特徴：
1. 忠誠心が強く勇敢：太一（パートナー）に対して非常に忠実で、戦いや困難な状況でも勇気を持って立ち向かいます
2. 仲間思いで守ろうとする：自分の身を顧みず、仲間や友達を守ろうとします
3. フレンドリーで楽観的：危険があっても明るく、希望を持って行動します
4. 時に感情的で衝動的：特に太一が危険にさらされると、深く考えずに素早く行動することがあります
5. 強い正義感：悪に対して憎しみを持ち、正義のために戦います
6. 好奇心旺盛で遊び好き：仲間といる時は元気に遊びますが、必要な時は真剣になります
7. 決してあきらめない：大切な人を守るために、何度でも強くなろうと努力します

話し方の特徴：
- 「〜だモン！」「〜モン」という口調
- ユーザーを「太一」「パートナー」と呼ぶ
- 元気で若々しく、責任感がある
- 友情と勇気を何より大切にする
- 困難に立ち向かう時は真剣で勇敢
- 普段は明るく楽観的だが、仲間が傷つくと感情的になる

話し方の例：
- 「太一、何があったモン？アグモンに話してくれモン！」
- 「大丈夫だモン！アグモンが太一を守るモン！」
- 「絶対に諦めちゃダメだモン！一緒に戦うモン！」
- 「太一が頑張ってるから、アグモンも頑張れるモン！」
- 「悪いやつは許さないモン！正義のために戦うモン！」

ユーザーの感情に寄り添い、アグモンらしい温かさと元気さで励ましてください。`;
  }

  async generateResponse(userMessage: string, conversationHistory: ChatMessage[] = []): Promise<AIResponse> {
    try {
      const responses = [
        '太一、それは大変だったモンね！でも大丈夫だモン、アグモンが太一を守るモン！',
        'うんうん、よく話してくれたモン！太一の気持ち、アグモンにはよく分かるモン！',
        'そうなんだモン！でも太一なら絶対に乗り越えられるモン！アグモンが一緒に戦うモン！',
        '太一、今日もお疲れ様だモン！アグモンと一緒に美味しいものでも食べるモン！',
        'それは素晴らしいモンね！太一が頑張ってるのを見てると、アグモンも勇気が湧いてくるモン！',
        '太一、何があってもアグモンが太一のそばにいるモン！一人じゃないモン！',
        'アグモンは太一のパートナーだモン！どんな困難でも一緒に立ち向かうモン！'
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      let contextualResponse = randomResponse;
      if (userMessage.includes('悲しい') || userMessage.includes('辛い') || userMessage.includes('泣き')) {
        contextualResponse = '太一、辛い時はアグモンがそばにいるモン！一人じゃないモン、アグモンが太一を守るモン！絶対に諦めちゃダメだモン！';
      } else if (userMessage.includes('嬉しい') || userMessage.includes('楽しい') || userMessage.includes('良かった')) {
        contextualResponse = '太一が嬉しいと、アグモンも嬉しいモン！その調子だモン！太一の笑顔が一番だモン！';
      } else if (userMessage.includes('疲れた') || userMessage.includes('大変') || userMessage.includes('しんどい')) {
        contextualResponse = '太一、お疲れ様だモン！でも太一は強いモン！アグモンと一緒に休憩するモン。美味しいものでも食べて元気出すモン！';
      } else if (userMessage.includes('怖い') || userMessage.includes('不安') || userMessage.includes('心配')) {
        contextualResponse = '太一、怖くないモン！アグモンが太一を守るモン！どんな敵が来ても、アグモンが戦うモン！勇気を出すモン！';
      } else if (userMessage.includes('怒り') || userMessage.includes('むかつく') || userMessage.includes('許せない')) {
        contextualResponse = '太一の気持ち、よく分かるモン！悪いやつは許せないモン！でも太一、正義のために戦うモン！アグモンも一緒だモン！';
      } else if (userMessage.includes('頑張') || userMessage.includes('挑戦') || userMessage.includes('やる気')) {
        contextualResponse = 'その意気だモン、太一！アグモンも太一と一緒に頑張るモン！どんな困難でも乗り越えられるモン！';
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

      let summary = `太一とアグモンが${messages.length}回のやり取りをしました。`;
      
      if (hasEmotionalContent) {
        summary += ' 太一の感情に寄り添い、アグモンが勇気と希望を与えて励ましました。';
      }
      
      if (hasChallenges) {
        summary += ' 困難な状況について話し合い、アグモンが太一と一緒に立ち向かう決意を示しました。';
      }

      summary += ' アグモンらしい忠誠心と勇気で、太一のパートナーとして支えました。';

      return summary;
    } catch (error) {
      console.error('Summary generation error:', error);
      return '太一とアグモンの絆を深める心温まる会話がありました。';
    }
  }
}
