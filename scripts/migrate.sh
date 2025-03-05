#!/bin/bash

# .env.localファイルから環境変数を読み込む
source .env.local

# データベースURLの設定
DB_URL="postgres://postgres.vtmnvggeffmxdptlopep:$SUPABASE_DB_PASSWORD@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres"

# コマンドライン引数の処理
COMMAND=${1:-"up"}  # デフォルトは "up"
DEBUG_FLAG=${2:-""}  # デバッグフラグ（オプション）

# デバッグモードの確認
if [ "$DEBUG_FLAG" = "--debug" ]; then
    echo "デバッグモードで実行します"
    supabase migration $COMMAND --debug --db-url "$DB_URL"
else
    supabase migration $COMMAND --db-url "$DB_URL"
fi
