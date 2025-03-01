# 日記テンプレート機能の実装タスク

## 概要
日記入力時にテンプレートを選択し、入力欄に自動的にテンプレート内容を挿入できる機能を実装する。

## 既存の実装状況

1. 型定義（lib/types.ts）
```typescript
export interface JournalTemplate {
  id: string;
  userId: string;
  title: string;
  content: string;
  tags: string[];
}
```

2. 設定ページ（app/journal/settings/page.tsx）
- テンプレート一覧表示
- テンプレート追加ボタン
- TemplateDialogコンポーネントの利用（未実装）

## 実装が必要な項目

### 1. データベース
- journal_templatesテーブルの作成
  - 詳細仕様は docs/features/journal-template-design.md を参照

### 2. コンポーネント実装

#### TemplateDialogコンポーネント（components/journal/TemplateDialog/index.tsx）
要件：
- テンプレート名と内容を入力するフォーム
- バリデーション機能
- 保存機能
- shadcn/uiのDialogコンポーネントをベースに実装

必要なプロパティ：
```typescript
interface TemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (template: Omit<JournalTemplate, 'id' | 'userId'>) => void;
}
```

#### TemplateSelector（新規作成）
要件：
- 日記入力画面でテンプレート選択UIを提供
- 選択したテンプレートの内容を入力欄に反映

### 3. API実装

#### テンプレート操作のAPI
- テンプレート作成
- テンプレート一覧取得
- テンプレート更新
- テンプレート削除

## 注意事項
1. 既存コードとの整合性を維持
2. shadcn/uiのコンポーネントを活用
3. 型安全性の確保
4. エラーハンドリングの実装
5. ユーザー体験の最適化

## 参照ドキュメント
- docs/features/journal-template.md（機能仕様）
- docs/features/journal-template-design.md（基本設計）
- docs/features/journal-template-index-performance.md（パフォーマンス考慮事項）
