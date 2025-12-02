# TODO アプリ

- シンプルで使いやすいTODOアプリケーションです。HTML、CSS、JavaScriptのみで作成されています。
- [シンプルなTODOアプリを⁠⁠、Claude Codeを使って5分で作って30分で公開する](https://gihyo.jp/article/2025/11/get-started-claude-code-03)を参考に、Claude Code で作成し、Git にプッシュするところまで行った。

## 機能

- **CRUD操作**: TODOの追加、表示、編集、削除
- **優先度設定**: 高、中、低の3段階で優先度を設定可能
- **フィルタリング**: 全て、未完了、完了済みでフィルタ表示
- **永続化**: LocalStorageを使用してデータを自動保存
- **レスポンシブデザイン**: スマートフォンにも対応

## 使い方

1. リポジトリをクローン
```bash
git clone https://github.com/YOUR_USERNAME/todo-app.git
cd todo-app
```

2. ブラウザで `index.html` を開く
```bash
start index.html
```

または、ローカルサーバーを起動
```bash
npx serve
```

## 技術スタック

- HTML5
- CSS3 (Flexbox、グラデーション、アニメーション)
- Vanilla JavaScript (ES6+)
- LocalStorage API

## ファイル構成

```
todo-app/
├── index.html   # メインHTMLファイル
├── style.css    # スタイルシート
├── script.js    # アプリケーションロジック
└── README.md    # このファイル
```

## ライセンス

MIT License
