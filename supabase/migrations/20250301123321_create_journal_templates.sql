/*
  # 日記テンプレート機能のマイグレーション

  このマイグレーションでは、ユーザーが日記のテンプレートを保存・管理するための
  テーブルとセキュリティ設定を作成します。

  ## 作成するもの

  1. テーブル
    - `journal_templates`
      - テンプレートのタイトルと内容を保存
      - 各テンプレートはユーザーに紐づく
      - 作成日時と更新日時を自動的に記録

  2. セキュリティ設定
    - Row Level Security (RLS) の有効化
    - ユーザーごとのアクセス制御ポリシー

  3. インデックス
    - ユーザーIDによる検索を最適化
*/

-- テーブルの作成
-- ユーザーが作成した日記テンプレートを保存するテーブル
CREATE TABLE IF NOT EXISTS journal_templates (
  -- テンプレートの一意識別子
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- テンプレートを所有するユーザーのID
  user_id UUID NOT NULL REFERENCES auth.users(id),

  -- テンプレートのタイトル（100文字まで）
  title VARCHAR(100) NOT NULL,

  -- テンプレートの本文
  content TEXT NOT NULL,

  -- テンプレートの作成日時（自動設定）
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  -- テンプレートの最終更新日時（自動設定）
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  -- ユーザーが削除された場合、関連するテンプレートも自動的に削除
  CONSTRAINT fk_user
    FOREIGN KEY(user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE
);

-- インデックスの作成
-- user_idでの検索を高速化するためのインデックス
CREATE INDEX IF NOT EXISTS idx_journal_templates_user_id ON journal_templates(user_id);

-- Row Level Security (RLS) の有効化
-- これにより、明示的なポリシーがない限りすべてのアクセスが拒否される
ALTER TABLE journal_templates ENABLE ROW LEVEL SECURITY;

-- セキュリティポリシーの設定
DO $$
BEGIN
    -- 1. 読み取りポリシー
    IF NOT EXISTS (
        SELECT FROM pg_policies
        WHERE tablename = 'journal_templates'
        AND policyname = 'Users can view their own templates'
    ) THEN
        CREATE POLICY "Users can view their own templates"
        ON journal_templates
        FOR SELECT
        TO authenticated
        USING (auth.uid() = user_id);
    END IF;

    -- 2. 作成ポリシー
    IF NOT EXISTS (
        SELECT FROM pg_policies
        WHERE tablename = 'journal_templates'
        AND policyname = 'Users can create their own templates'
    ) THEN
        CREATE POLICY "Users can create their own templates"
        ON journal_templates
        FOR INSERT
        TO authenticated
        WITH CHECK (auth.uid() = user_id);
    END IF;

    -- 3. 更新ポリシー
    IF NOT EXISTS (
        SELECT FROM pg_policies
        WHERE tablename = 'journal_templates'
        AND policyname = 'Users can update their own templates'
    ) THEN
        CREATE POLICY "Users can update their own templates"
        ON journal_templates
        FOR UPDATE
        TO authenticated
        USING (auth.uid() = user_id);
    END IF;

    -- 4. 削除ポリシー
    IF NOT EXISTS (
        SELECT FROM pg_policies
        WHERE tablename = 'journal_templates'
        AND policyname = 'Users can delete their own templates'
    ) THEN
        CREATE POLICY "Users can delete their own templates"
        ON journal_templates
        FOR DELETE
        TO authenticated
        USING (auth.uid() = user_id);
    END IF;
END $$;

-- 更新日時を自動的に設定するための関数
CREATE OR REPLACE FUNCTION update_template_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- トリガーの設定
-- テンプレートが更新される度に更新日時を自動的に設定
DROP TRIGGER IF EXISTS update_journal_templates_updated_at ON journal_templates;
CREATE TRIGGER update_journal_templates_updated_at
  BEFORE UPDATE ON journal_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_template_updated_at_column();
