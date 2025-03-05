# Supabaseのnot-null制約エラーの対処

## 発生日時
2024/03/21

## 問題
- テーブルにデータを挿入する際に400エラーが発生
- エラーメッセージ: `null value in column "created_at" of relation "journal_templates" violates not-null constraint`

## 原因
1. マイグレーションファイルでは`DEFAULT CURRENT_TIMESTAMP`を指定
```sql
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
```

2. しかし実際のテーブルでは：
- `created_at`と`updated_at`のデフォルト値がNULLで設定されていた
- これらのカラムはnot-null制約があるため、NULLが入ることでエラーとなった

## 試したこと
1. `select()`の指定方法を変更
```typescript
// Before
.insert(insertData)
.select('id, user_id, title, content')
```

2. `created_at`と`updated_at`を明示的に指定
```typescript
const insertData = {
  user_id: template.userId,
  title: template.title,
  content: template.content,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};
```

## 解決策
1. タイムスタンプカラムを明示的に指定
```typescript
const insertData = {
  user_id: template.userId,
  title: template.title,
  content: template.content,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};
```

2. マイグレーションファイルとテーブルの実際の設定を同期
```sql
-- マイグレーションファイルの内容が正しく反映されているか確認
-- 必要に応じてテーブルを再作成
```

## 学んだこと
1. エラーが発生したら：
   - エラーメッセージを注意深く読む
   - マイグレーションファイルと実際のテーブル設定を比較

2. デバッグのポイント：
   - コンソールログで送信データの内容を確認
   - データベースのカラム制約を確認
   - マイグレーションが正しく適用されているか確認

3. 予防策：
   - マイグレーション適用後にテーブル設定を確認
   - タイムスタンプ系カラムのデフォルト値を必ず確認
   - not-null制約のあるカラムは特に注意

## 関連ファイル
- マイグレーションファイル: `supabase/migrations/20250301123321_create_journal_templates.sql`
- 実装ファイル: `lib/journal.ts`の`createTemplate`関数

## タグ
#supabase #database #migration #timestamp #not-null-constraint #troubleshooting
