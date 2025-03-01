# 日記テンプレート機能実装の指示書

## 作業の背景
ユーザーが日記を書く際に、あらかじめ定義したテンプレートを選択して入力欄に自動的に挿入できる機能を実装する必要があります。

## 実装の現状
1. 基本設計は完了（docs/features/journal-template-design.md参照）
2. 一部のUIコンポーネントは実装済み（settings/page.tsx）
3. テンプレート機能の型定義は完了（types.ts）

## 実装手順

### Step 1: データベース実装
1. journal_templatesテーブルの作成
```sql
CREATE TABLE journal_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  title VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_user
    FOREIGN KEY(user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE
);
```

2. インデックスの作成
```sql
CREATE INDEX idx_journal_templates_user_id ON journal_templates(user_id);
```

3. RLSポリシーの設定（詳細はjournal-template-design.mdを参照）

### Step 2: コンポーネント実装

#### 2.1 TemplateDialogの実装（components/journal/TemplateDialog/index.tsx）
```typescript
// 必要なプロパティ
interface TemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (template: Omit<JournalTemplate, 'id' | 'userId'>) => void;
}
```

実装要件：
- shadcn/uiのDialogコンポーネントを使用
- テンプレート名の入力フィールド（必須）
- テンプレート内容の入力フィールド（必須）
- バリデーション機能
- 保存ボタン

#### 2.2 TemplateSelectorの実装
- 日記入力画面にテンプレート選択UIを追加
- ドロップダウンまたはモーダルで選択UI実装
- 選択したテンプレートの内容を入力欄に反映する機能

### Step 3: API実装

以下のAPI関数を`lib/journal.ts`に追加：

```typescript
// テンプレート作成
export async function createTemplate(template: Omit<JournalTemplate, 'id'>) {
  const { data, error } = await supabase
    .from('journal_templates')
    .insert(template)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// テンプレート一覧取得
export async function getTemplates(userId: string) {
  const { data, error } = await supabase
    .from('journal_templates')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// 以下も同様に実装
// - updateTemplate
// - deleteTemplate
```

## テスト項目

1. テンプレートの作成
   - 必須項目が入力されていない場合のバリデーション
   - 正常に保存できること

2. テンプレートの選択
   - テンプレート一覧が表示されること
   - 選択したテンプレートが入力欄に反映されること

3. エラーハンドリング
   - APIエラー時の適切なエラーメッセージ表示
   - ユーザーへのフィードバック

## 注意事項

1. 既存コードとの整合性
   - settings/page.tsxの実装に合わせること
   - 既存の型定義を活用すること

2. パフォーマンス考慮
   - インデックスの活用
   - 必要なデータのみを取得

3. セキュリティ
   - RLSポリシーの適切な設定
   - ユーザー入力のバリデーション
   - XSS対策

## 参照ドキュメント
- docs/features/journal-template.md（機能仕様）
- docs/features/journal-template-design.md（基本設計）
- docs/features/journal-template-index-performance.md（パフォーマンス）
- docs/tasks/template-feature-implementation.md（実装タスク一覧）
