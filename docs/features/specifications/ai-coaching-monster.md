# AIコーチングモンスター仕様書

## 概要
ユーザーの感情状態やジャーナル活動に応じて進化するデジタルモンスターとの対話型コーチングシステム。

## システム構成図

```mermaid
graph TD
    A[ユーザー] --> B[ジャーナル入力]
    B --> C[感情分析]
    C --> D[モンスター反応]
    B --> E[継続度計算]
    C --> F[感情安定度計算]
    E --> G[進化条件チェック]
    F --> G
    G --> H[モンスター進化]
    D --> I[コーチング対話]
```

## データモデル

```mermaid
erDiagram
    User ||--o{ Monster : has
    User ||--o{ Journal : writes
    Monster ||--o{ Evolution : undergoes
    Monster {
        int level
        string current_form
        int emotional_stability
        int journal_streak
        string personality_type
    }
    Evolution {
        string from_form
        string to_form
        timestamp evolved_at
        json conditions_met
    }
    JournalMetrics {
        int emotional_stability
        int streak_count
        float sentiment_score
    }
```

## 主要機能

### 1. モンスター育成システム

#### 進化ステージ
- 初期形態：卵
- 進化条件：
  - ジャーナル継続日数（7日、30日、100日など）
  - 感情安定度スコア
  - 目標達成度

#### 成長指標
- ジャーナル執筆の継続度
- 感情の安定性
- 設定した目標の達成状況

### 2. インタラクティブUI

#### モンスター表示
- 画面上を左右に動くアニメーション
- 感情状態に応じた表情変化
- クリック/タップによるインタラクション

#### 対話インターフェース
- 吹き出し形式のメッセージ表示
- アニメーションによる感情表現
- タッチ操作への反応

### 3. コーチング対話システム

#### 対話機能
- ユーザーの感情状態に基づく応答生成
- 進化段階に応じた異なるコーチングスタイル
- パーソナライズされたアドバイスと励まし

#### パーソナライゼーション
- ユーザーの過去の行動パターンの学習
- 感情の変化に応じた適応的な対応
- 個人の目標に合わせたガイダンス

## 技術要件

### フロントエンド
- Framer Motion：アニメーション実装
- SVG/Canvas：キャラクターグラフィックス
- React：UIコンポーネント

### バックエンド
- GPT-4 API：対話生成
- 感情分析API：テキスト解析
- 進化ロジック処理システム

## 実装スケジュール

```mermaid
gantt
    title 実装計画
    dateFormat  YYYY-MM-DD
    section データベース
    モンスターテーブル設計    :2025-03-10, 2d
    進化条件テーブル設計    :2025-03-12, 2d
    section バックエンド
    進化ロジック実装    :2025-03-14, 3d
    コーチング対話システム    :2025-03-17, 5d
    section フロントエンド
    モンスターUI実装    :2025-03-14, 4d
    アニメーション実装    :2025-03-18, 3d
    インタラクション実装    :2025-03-21, 4d
```

## 次のステップ
1. データベーススキーマの詳細設計
2. モンスターのキャラクターデザイン
3. 進化条件の具体的な数値設定
4. コーチング対話のパターン設計