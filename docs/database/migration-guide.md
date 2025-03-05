# データベースマイグレーションガイド

このドキュメントでは、Supabase CLIを使用したデータベースマイグレーションの実行方法について説明します。

## 目次

1. [環境設定](#環境設定)
2. [マイグレーションファイルの作成](#マイグレーションファイルの作成)
3. [マイグレーションの実行](#マイグレーションの実行)
4. [トラブルシューティング](#トラブルシューティング)

## 環境設定

### 必要な環境変数

`.env.local`ファイルに以下の環境変数を設定します：

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_DB_PASSWORD=your-db-password
```

> **注意**: `.env.local`ファイルはGitにコミットしないでください。パスワードなどの機密情報が含まれています。

### 実行スクリプト

マイグレーション実行用のスクリプト`scripts/migrate.sh`が用意されています：

```bash
#!/bin/bash
source .env.local
supabase migration up --db-url "postgres://postgres.vtmnvggeffmxdptlopep:$SUPABASE_DB_PASSWORD@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres"
```

## マイグレーションファイルの作成

### 新しいマイグレーションの作成

```bash
supabase migration new create_users_table
```

このコマンドは`supabase/migrations`ディレクトリに新しいSQLファイルを作成します。

### マイグレーションファイルの構造

```sql
-- 例: 20250301123321_create_users_table.sql

/*
  # マイグレーションの説明

  このマイグレーションでは以下を実行します：
  1. テーブルの作成
  2. インデックスの追加
  3. RLSポリシーの設定
*/

-- テーブルの作成
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLSの有効化
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- ポリシーの作成
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT
  USING (auth.uid() = id);
```

## マイグレーションの実行

### マイグレーションコマンド

`migrate.sh`スクリプトは以下のコマンドをサポートしています：

```bash
# マイグレーションの実行（デフォルト）
./scripts/migrate.sh up

# マイグレーション状態の確認
./scripts/migrate.sh status

# 特定のバージョンまでロールバック
./scripts/migrate.sh reset

# デバッグモードでの実行（詳細なログを表示）
./scripts/migrate.sh up --debug
./scripts/migrate.sh status --debug
./scripts/migrate.sh reset --debug
```

各コマンドの説明：

- `up`: 未適用のマイグレーションを実行します
- `status`: 現在のマイグレーション状態を表示します
- `reset`: データベースをリセットし、全てのマイグレーションを再適用します
- `--debug`: 詳細なログ出力を有効にします（任意のコマンドに追加可能）

### 手動での実行

スクリプトを使用せずに直接実行する場合：

```bash
source .env.local && supabase migration up --db-url "postgres://postgres.vtmnvggeffmxdptlopep:$SUPABASE_DB_PASSWORD@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres"
```

## トラブルシューティング

### よくあるエラー

1. **接続エラー**
   ```
   Error: failed to connect to postgres
   ```
   - データベースのURLが正しいか確認
   - パスワードが正しく設定されているか確認
   - ネットワーク接続を確認

2. **権限エラー**
   ```
   Error: permission denied
   ```
   - スクリプトに実行権限があるか確認
   - `chmod +x scripts/migrate.sh`を実行

3. **環境変数エラー**
   ```
   Error: environment variable not set
   ```
   - `.env.local`ファイルが存在するか確認
   - 必要な環境変数が設定されているか確認

### デバッグモード

詳細なログを表示してデバッグする場合：

```bash
./scripts/migrate.sh --debug
```

### エラー発生時の対応

1. ログを確認
2. 必要に応じてロールバック
3. エラーを修正して再実行

## 補足情報

- マイグレーションファイルは一度実行されると、そのバージョンは記録され、同じファイルは再実行されません
- マイグレーションファイルの名前は変更しないでください
- 本番環境でのマイグレーション実行は慎重に行ってください
