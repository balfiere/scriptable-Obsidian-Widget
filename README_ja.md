[English](README.md)
# Obsidian Widget for Scriptable

ObsidianのノートをiOS/iPadOSのホーム画面ウィジェットに表示するためのScriptable用スクリプトです。見出し、リスト、太字、斜体、リンクなど、Markdownの基本的な書式をウィジェット上で再現します。

![screenshot](.readme-images/screenshot.png)

## ✨ 特徴

-   **Markdownサポート**: 見出し (`#`), ToDoリスト (`- [ ]`), 箇条書きリスト (`-`), 番号付きリスト (`1.`) などの表示に対応しています。
-   **テキストスタイル**: `**太字**` や `*斜体*` のテキストを正しく描画します。
-   **クリック可能なURL**: URLをタップすると、直接ブラウザで開くことができます。
-   **テーマ対応**: iOSのライトモード/ダークモードに連動して、ウィジェットの配色が自動で切り替わります。
-   **高いカスタマイズ性**: フォントサイズ、色、行間、表示項目などをスクリプト内で細かく設定できます。
-   **タスク管理**: 未完了のタスク数をウィジェットに表示する機能があります。
-   **Obsidian連携**: ウィジェットをタップすると、Obsidianアプリで該当のノートを直接開くことができます。
-   **手動更新**: ウィジェット右上の更新アイコンをタップすると、内容を最新の状態にリロードできます。

## 📥 導入と設定

このスクリプトを使用するには、いくつかの事前準備が必要です。

### Step 1: ファイルのダウンロードと配置

1.  このリポジトリからファイルをダウンロードします。
2.  スクリプトファイル `obsidian_widget.js` をScriptableアプリにインストールします。
3.  `Images` フォルダを、iCloud DriveのScriptable用フォルダの直下に配置します。

    ```
    iCloud Drive
    └── Scriptable
        ├── obsidian_widget.js   (スクリプト本体)
        └── Images               (このフォルダを配置)
            ├── 0.png
            ...
            └── square.png
    ```

### Step 2: ScriptableのFile Bookmarks設定

ウィジェットに表示したいMarkdownファイルが保存されているフォルダをScriptableに登録します。

1.  Scriptableアプリを開き、右上の歯車アイコンから `設定` > `File Bookmarks` に移動します。
2.  `Add Bookmark` をタップし、ObsidianのVaultフォルダなど、Markdownファイルが格納されているフォルダを選択します。
3.  **ブックマーク名**（例: `obsidian-vault`）を入力して保存します。この名前は次のステップで使用します。

> **Note**
> このスクリプトは基本的にObsidianのVaultフォルダを対象としていますが、Markdownファイルが直下に保存されているフォルダであれば、どのフォルダでも利用可能です。

### Step 3: スクリプトの編集

インストールした `obsidian_widget.js` を開き、以下の項目を設定します。

1.  **デバイスと文字タイプの設定**
    スクリプトの冒頭で、`isPhone` と `USE_FULL_WIDTH_CHARS` を設定します。これは正しいレイアウトと文字の折り返しのために重要です。

    ```javascript
    const isPhone = true; // iPhoneの場合は `true`、iPadの場合は `false` に設定します。
    const USE_FULL_WIDTH_CHARS = false; // ノートが主に日本語や中国語などの全角文字で構成されている場合は `true` に設定します。
    ```

2.  **`bookmarkedFolderName` の設定**
    Step 2で設定したブックマーク名を、`bookmarkedFolderName` 変数に設定します。

    ```javascript
    // 例
    const bookmarkedFolderName = 'obsidian-vault';
    ```

3.  **`fileName_runsInApp` の設定**
    Scriptableアプリ内でスクリプトを実行した際のテスト表示に使われるファイル名です。ブックマークしたフォルダ内に**実在するファイル名**（`.md`は不要）を設定してください。

    ```javascript
    // 例: example.mdを表示する場合
    const fileName_runsInApp = 'example';
    ```

### Step 4: ウィジェットの配置

1.  ホーム画面を長押しして、左上の「+」からウィジェットを追加します。
2.  `Scriptable` を選択し、好きなサイズのウィジェットをホーム画面に配置します。
3.  配置したウィジェットを長押しし、「ウィジェットを編集」を選択します。
    -   **Script**: `obsidian_widget` を選択します。
    -   **Parameter**: ウィジェットに表示したいノートのファイル名（`.md`は不要）を入力します。

これで設定は完了です！ホーム画面にObsidianのノートが表示されます。

## ⚙️ カスタマイズ

スクリプト冒頭の `== Basic Display Settings ==` および `== Color and Style Settings ==` の項目を編集することで、ウィジェットの見た目をカスタマイズできます。

### 基本表示設定

| 定数名                       | 説明                                                                                                                                                                             |
| :--------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `isPhone`                    | 使用するデバイスがiPhoneの場合は `true`、iPadの場合は `false` に設定します。iPhoneとiPadではウィジェットのサイズや余白計算が異なるため、この設定を間違えると表示が崩れる原因となります。 |
| `USE_FULL_WIDTH_CHARS`       | ノートが主に日本語や中国語などの全角文字で構成されている場合に `true` に設定します。これにより、自動改行の精度が向上します。                                                          |
| `FONT_SIZE`                  | フォントサイズを数値で指定します。                                                                                                                                     |
| `LINE_SPACING`               | 各行の間の余白を数値で指定します。                                                                                                                                                 |
| `PARTITION_STRING`           | ノート内にこの文字列（デフォルトは `---`）があると、そこから下の内容はウィジェットに表示されません。                                                                                |
| `SHOW_FIRSTLINE_AS_PLAINTEXT`| `true`にすると、ウィジェットの1行目を通常のテキストスタイルで表示します。`false`だと特別なスタイルが適用されます。                                                                   |
| `SHOW_FILENAME_ON_FIRSTLINE` | `true`にすると、ウィジェットの1行目にファイル名を表示します。                                                                                                                    |
| `SHOW_TASK_NUMBER`           | `true`にすると、未完了のタスク数をファイル名の横に表示します。                                                                                                                   |

### 色とスタイルの設定

| 定数名                   | 説明                                                                |
| :----------------------- | :------------------------------------------------------------------ |
| `DARK_BACKGROUND_COLOR`  | ダークモード時のウィジェット背景色を16進数カラーコードで指定します。  |
| `LIGHT_BACKGROUND_COLOR` | ライトモード時のウィジェット背景色を16進数カラーコードで指定します。  |
| `FIRST_LINE_COLOR_LIGHT` | ライトモード時の1行目（ファイル名など）のテキスト色を指定します。     |
| `FIRST_LINE_COLOR_DARK`  | ダークモード時の1行目（ファイル名など）のテキスト色を指定します。     |

### 高度なスタイル設定 (`CONFIG` オブジェクト)

`CONFIG` オブジェクトやスクリプトの他の部分を編集することで、さらに詳細なスタイル調整が可能です。

-   **要素のスタイル**: `CONFIG` オブジェクト内で、`h1`, `h2`, `url` などの要素の色をライトモード (`color_light`) とダークモード (`color_dark`) 別に設定できます。
    
    > **⚠️ 注意**
    > `fontSizeScale` は各要素の相対的な大きさを決定します。この値を変更すると、行の折り返し計算がずれてレイアウトが崩れる可能性があります。変更にはご注意ください。

-   **チェックボックスのスタイル変更**: デフォルトのチェックボックスは円形 (`SFSymbol.named('circle').image`) です。四角いチェックボックスを使用するには、`addListMarker` 関数を編集します。`Images` フォルダに `square.png` ファイルがあることを確認してください。

    ```javascript
    // addListMarker 関数内:
    function addListMarker(stack, config, type, listNumber) {
        switch (type) {
            case 'todo':
                // const todoImage = SFSymbol.named('circle').image;
                const todoImage = storeImage('square.png'); // この行のコメントを解除すると、四角いチェックボックスが使えます
                addImage(stack, todoImage, config);
                break;
            // ...
        }
    }
    ```

## ⚠️ 注意点

-   **ファイル階層について**
    -   このスクリプトは、File Bookmarksで指定したフォルダの**直下にあるファイル**のみを表示できます。サブフォルダ内のファイルはサポートされていません。

## 謝辞

このスクリプトは、以下のプロジェクトを参考に作成されました。

-   ぽっぽさん: [【Scriptable】Obsidianのメモをホーム画面に表示する](https://note.com/walking_poppo/n/n31e5ef576e72)
-   Angus Thompson: [obsidian-scriptable-tasks-widget](https://github.com/angus-thompson/obsidian-scriptable-tasks-widget)