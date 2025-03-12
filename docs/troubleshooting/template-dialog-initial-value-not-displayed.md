# TemplateDialogに初期値が表示されない

## 問題

テンプレート編集時に、`TemplateDialog`コンポーネントに初期値（編集対象のテンプレートデータ）が表示されない。

## 原因

`TemplateDialog`コンポーネントに渡される`initialTemplate`プロパティが、コンポーネントの再レンダリング前に更新されないため、初期値が反映されない。

具体的には、以下の状況が考えられる。

*   `TemplateManagementPage`コンポーネントで`setEditingTemplate`関数を呼び出して`editingTemplate`ステートを更新しているが、Reactのステート更新は非同期的に行われるため、`TemplateDialog`コンポーネントが表示される前に再レンダリングが発生しない。
*   `TemplateDialog`コンポーネントは、`isTemplateDialogOpen`ステートが`true`になったときに初めてレンダリングされるが、その時点で`editingTemplate`ステートがまだ更新されていないため、`initialTemplate`プロパティに`undefined`が渡される。

## 解決方法

`TemplateDialog`コンポーネントの`key`プロパティを利用して、`editingTemplate`が更新されたときにコンポーネントを再マウントさせる。

1.  **`TemplateManagementPage`コンポーネントの修正:**

    `TemplateDialog`コンポーネントの`key`プロパティに、`editingTemplate`の`title`プロパティを設定する。

    ```typescript
    <TemplateDialog
      open={isTemplateDialogOpen}
      onOpenChange={setIsTemplateDialogOpen}
      onSave={handleSaveTemplate}
      initialTemplate={editingTemplate}
      key={editingTemplate?.title} // keyプロパティを追加
    />
    ```

2.  **重要なポイント:**

    *   `key`プロパティは、Reactがコンポーネントを識別し、再利用するかどうかを判断するために使用される。
    *   `key`プロパティの値が変更されると、Reactはコンポーネントを再マウントし、新しいプロパティを渡す。
    *   `editingTemplate?.title`を使用することで、`editingTemplate`が`undefined`の場合でもエラーが発生しないようにする。

## 今後の注意点

*   Reactのステート更新は非同期的に行われることを理解し、ステートの更新が完了する前にコンポーネントがレンダリングされる可能性があることを考慮する。
*   コンポーネントの再レンダリングを制御するために、`key`プロパティを適切に使用する。
*   コンポーネントに渡されるプロパティが、コンポーネントのレンダリング前に確実に更新されるように、ステート管理を適切に行う。