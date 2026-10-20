# 命名

原則: 名前は、中身が何か、呼び出しコストがどれくらいかを、コメントなしで読み手に伝えるべき。

## データを返す関数の動詞

TS/JS のプロジェクトで最もよくある問題は、何にでも `get` を使うこと。`getXxx` を見ても、遅いのか、失敗しうるのか、エラー処理が必要なのか判断できない。

動詞でコストを伝える:

| 動詞 | 意味 | 失敗しうるか / 非同期か |
| --- | --- | --- |
| `fetch` | 外部へのネットワークリクエスト（HTTP、外部 API） | しうる / たいてい非同期 |
| `load` / `query` | ストレージからの読み込み（DB、ファイル、キャッシュ） | しうる / たいてい非同期 |
| `compute` / `calc` / `build` | 純粋なローカル計算 | しない / 同期 |
| `get` | すでにメモリ上にあるものへの安価なアクセス（アクセサ、Map の参照） | しない / 同期 |

この表はデフォルトの目安にすぎない。プロジェクトにすでに独自の語彙があるならそれに従い、その中での不統一だけを指摘する。

### 例（作者自身のプロジェクトより）

```ts
// lib/news-fetcher.ts — 外部通信するので fetch ✅
export async function fetchNews(query: string) { ... }

// features/ai/lib/getNews.ts — fetchNews を包んでいるのに get ❌
export const getNews = tool({ execute: ... fetchNews(...) })

// features/assets/server/assets.ts — DB を読むのに get
export async function getAssets() { ... supabase.from("assets") ... }

// features/assets/lib/date-utils.ts — ローカル計算だけなのに get ❌
export function getFromDate(range) { ... }
```

ここで出すべき指摘:
- `getFromDate` → `computeFromDate`（純粋な計算）
- `getAssets` → `loadAssets` または `queryAssets`（ストレージの読み込み）
- `getNews` → AI 向けのツールだと分かる名前、たとえば `newsTool`。さらに、同じ処理に `fetchNews` と `getNews` の 2 つの名前がある。

## その他のチェック

- **汎用的な名前**（`tmp`、`data`、`result`、`info`、`retval`）: 変数のスコープが数行を超える場合や、具体的なものを保持している場合だけ指摘する。3 行の swap での `tmp` は問題ない。
- **単位がない**: 時間・サイズ・金額を表す数値には単位を付ける — `timeoutMs`、`maxSizeBytes`、`priceJpy`。
- **注意が必要な属性がない**: 扱いに注意すべき値はそれを名前で示す — `rawHtml` / `unsafeHtml`（対になるのは `sanitizedHtml`）、`plaintextPassword`。
- **長さとスコープ**: ごく狭いスコープなら短い名前でよい（1 行のコールバックでの `i`、`x`）。export される名前やモジュールレベルの名前には十分な情報を持たせる。
- **略語**: チームの新メンバーが読んで分かるもの（`id`、`url`、`db`）だけを許す。プロジェクト内だけで通じる略語は指摘する。
- **同じ概念に別の名前**（または同じ名前に別の概念）: 同じコードベース内で混在していれば指摘する。

## 指摘しないもの

- フレームワークやライブラリが要求する名前（React の `useX`、Next.js の `getServerSideProps`、ORM のメソッド名）
- 命名の大文字小文字規則（camelCase など） — ESLint に任せる
- 影響範囲が大きい改名（公開 API、呼び出し元が多い）を、影響範囲を書かずに提案すること。その場合は影響範囲を列挙し、重要度を `should` に下げる。
