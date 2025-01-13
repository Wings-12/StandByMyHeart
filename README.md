# 日記アプリ
Translate in English

## イメージ
![image](https://github.com/user-attachments/assets/966717c9-8a6e-42a5-950e-8e3f4a154106)

![image](https://github.com/user-attachments/assets/7b15bde1-b8ea-4103-9a2a-954bdd37593a)

![image](https://github.com/user-attachments/assets/a15bfaa6-a4cb-4168-ae31-a213ddd58c66)

## 概要
このアプリケーションは、ユーザーが1日の振り返りをするための Web アプリです。Next.js と Supabase を用いた認証機能や、感情レベル（落ち込み・落ち込み気味・普通・元気・とても元気）を可視化するコンポーネントを備えています。ユーザーはログインして日々の気持ちを記録し、振り返ることができます。

## 動作環境
Node.js 18.x
npm 9.x
Next.js 13.x
Supabase

## 環境構築
- リポジトリをクローン後、以下のコマンドで依存関係をインストールしてください。
```
nmp install
```
- Next.js の開発サーバーを起動します。
```
npm run dev
```

## 使い方
日記ページでは、気持ちと感情レベルを入力して記録できます。

## 注意事項
環境変数は .env.local などで設定してください。

// TODO：
1. 環境変数を使用したリダイレクトURL設定
1. ログイン時のリダイレクト処理の修正
1. Next.jsでは静的コンテンツを自動でキャッシュしているか確認
1. DBデータをキャッシュした方が安く運用できるか確認
1. 今の気持ちを10メモリに変更
1. Googleカレンダーと連携して、時間ブロックして予定を入れられるようにする
