# テンプレート再選択時の適用問題

## 問題
TemplateSelectorコンポーネントで以下の現象が発生：
1. テンプレートを選択してTextareaに内容が表示される
2. その内容を削除する
3. 同じテンプレートを再度選択しても内容が表示されない

## 原因
1. Reactの`Select`コンポーネント（@radix-ui/react）の仕様：
   - 同じ値が選択された場合、`onValueChange`イベントが発火しない
   - これは値の重複選択を最適化する一般的なReactの動作

2. イベントの発火順序：
   ```
   1回目の選択：
   ├── SelectItemクリック
   ├── onValueChange発火
   └── テンプレート適用

   2回目の選択（同じ値）：
   ├── SelectItemクリック
   └── onValueChange発火しない（値が同じため）
   ```

## 解決方法
1. イベントハンドリングの修正：
   ```typescript
   // テンプレート選択時の処理
   const handleValueChange = (value: string) => {
     const template = templates.find(t => t.id === value);
     if (template) {
        // 選択したテンプレートを
       onSelectTemplate(template);
     }
   };

   // ドロップダウンの開閉時の処理を追加
   const handleOpenChange = (open: boolean) => {
     // ドロップダウンが閉じた時に再適用
     if (!open && selectedTemplateId) {
       const template = templates.find(t => t.id === selectedTemplateId);
       if (template) {
         onSelectTemplate(template);
       }
     }
   };
   ```

2. 重要なポイント：
   - `onValueChange`：値の変更時にテンプレートを適用
   - `onOpenChange`：ドロップダウンが閉じる時に現在の選択を再適用
   - 両方のイベントを使用することで、より確実なテンプレート適用を実現

## 学んだこと
1. コンポーネントライブラリの実装詳細：
   - Reactコンポーネントの最適化機能を理解する重要性
   - イベントの発火条件と順序の把握

2. 解決アプローチ：
   - 単一のイベントに依存せず、複数のイベントを組み合わせる
   - コンポーネントの状態変化を複数の角度から監視

3. デバッグの手順：
   - 問題の再現手順を明確化
   - ログ出力による状態変化の追跡
   - イベントの発火順序の確認

## 実装のベストプラクティス
1. イベントハンドラの分離：
   ```typescript
   const handleValueChange = (value: string) => { ... };
   const handleOpenChange = (open: boolean) => { ... };
   ```

2. 明確な責務分担：
   - `handleValueChange`：値の変更に対する処理
   - `handleOpenChange`：UI状態の変更に対する処理

3. ログ出力による状態管理：
   ```typescript
   console.log('値の変更を検知:', {
     新しい値: value,
     前回の値: selectedTemplateId
   });
   ```

## 今後の注意点
1. コンポーネントライブラリ使用時：
   - 基本的な動作と最適化機能の確認
   - イベントの発火条件の理解

2. 状態管理：
   - 複数のイベントを組み合わせた堅牢な実装
   - 適切なログ出力による動作の可視化

3. テスト観点：
   - 同じ値の再選択パターン
   - イベントの発火順序の確認
   - エッジケースの考慮
