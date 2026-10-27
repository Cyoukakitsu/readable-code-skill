# readable-code-skill

『リーダブルコード』（Dustin Boswell / Trevor Foucher 著、角 征典 訳、オライリー・ジャパン、原書 *The Art of Readable Code*）の原則をもとに作った Claude Code のスキルです。
「コードは他の人が最短時間で理解できるように書く」という考え方に沿って、TypeScript / JavaScript のコードを**可読性の観点でレビュー**します。

- **レビューのみで、コードは書き換えません**。重要度（must / should / optional）、影響範囲、確認の根拠を付けた指摘の一覧を出します。直すかどうかは自分で決めます。
- **Claude がまだ知らないことだけを足しています**。本の一般的な原則は、Claude はもともと知っています。このスキルが書いているのは、判断の取捨選択、例外、誤判定しやすいところです（例：信頼境界での防御を「不要なコード」として扱わない）。
- 内容は本の原則を**自分なりにまとめ直したもの**です。例はすべて作者自身のプロジェクトのコードで、原書の文章や例は含みません。詳しく知りたい方は原書をお読みください。
- スキル本文は日本語で書いています。レビュー結果は、質問した人の言語で出力されます。

## インストール

```bash
git clone https://github.com/Cyoukakitsu/readable-code-skill.git
mkdir -p ~/.claude/skills
cp -r readable-code-skill/skills/readable-code-review ~/.claude/skills/
```

コピーの代わりにシンボリックリンクを使うと、リポジトリを `git pull` するだけで更新できます。

```bash
ln -s "$(pwd)/readable-code-skill/skills/readable-code-review" ~/.claude/skills/readable-code-review
```

### 更新

`~/.claude/skills/` にコピーしたものは、リポジトリを更新しても自動では変わりません。章を追加したあとなどは、次のようにコピーし直してください。

```bash
cd readable-code-skill
git pull
cp -r skills/readable-code-review ~/.claude/skills/
```

Claude Code で「このコード読みやすい？」「可読性レビューして」「readability review」などと頼むと使われます。「readable-code-review でこのファイルをレビューして」と名前で呼び出すこともできます。

## 構成

```
skills/readable-code-review/
├── SKILL.md                    # レビューの進め方、出力形式、注意点
└── references/
    ├── defensive-code.md       # 不要な防御コード（第 1 章）
    ├── naming.md               # 命名（第 2・3 章）
    ├── comments.md             # コメント（第 5・6 章）
    ├── compression.md          # 巨大な式と詰め込み（第 1・8 章）
    ├── control-flow.md         # 制御フロー（第 7 章）
    ├── variables.md            # 変数（第 9 章）
    ├── extraction.md           # 下位問題の抽出（第 10 章）
    ├── single-task.md          # 一度に一つのこと（第 11 章）
    └── explain-first.md        # 説明と構造の対応（第 12 章）
```

第 4 章（美しさ）は独立したファイルにしていません。見た目の整形はフォーマッタの仕事なので、SKILL.md に「指摘しない」ルールとして入れています。

## 進捗

読み進めるのに合わせて、章ごとにルールを追加していきます。現在は第 1〜12 章までを反映しています。読書メモは [Qiita](https://qiita.com/ZHAOJIAYI/items/08e7f3ec02133efd1ddc) と [Zenn](https://zenn.dev/zhaojiayi) で公開しています。
