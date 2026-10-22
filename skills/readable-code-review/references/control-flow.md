# 制御フロー

原則: 読み手が頭の中で同時に抱える情報を減らす。「いまどの分岐の中にいるか」「どの条件が成り立っているか」「どこまで実行されたか」を覚えておかなくても読めるようにする。（第 7 章）

この章の規則の多くは ESLint で検出できる（`yoda`、`no-nested-ternary`、`max-depth`、`no-else-return`、`max-nested-callbacks`）。lint との分担は SKILL.md の「指摘する前に」に従う。このファイルが力を入れるのは、lint では判断できない「どう直すと読みやすいか」と「バグにつながるか」のほう。

## ネストを浅くする

- ネストの段数は、`if` / `for` / `while` / `switch` / `try` のブロックだけを数える（ESLint の `max-depth` と同じ数え方）。JSX 要素の入れ子とコールバックは数えない（コールバックは `max-nested-callbacks` の範囲）。
- 4 段を超えたら指摘する（`should`）。`max-depth` の既定値と同じ。
- 修正案は次の順に検討する。
  1. 失敗・null・対象外のケースを先に `return` する（ガード節）
  2. ループの中なら `continue` で対象外を飛ばす
  3. 内側のかたまりを、名前の付いた関数に切り出す
- 「関数の出口は 1 つにすべき」という理由で早期 `return` を避けているコードには、早期 `return` を提案してよい。後片付けが必要なら `try/finally` に任せる。

### 例（作者自身のプロジェクトより）

```ts
// features/ai/components/analysis-shell.tsx（SSE の読み取り）
try {
  ...
  while (true) {
    ...
    for (const line of lines) {
      if (line.startsWith("event: ")) {
        currentEvent = line.slice(7).trim();
      } else if (line.startsWith("data: ") && currentEvent) {
        const data = JSON.parse(line.slice(6));
        if (currentEvent === "agent1_done" || currentEvent === "agent2_done") {
          ...
        } else if (currentEvent === "coordinator_done") {
          ...
```

ここで出すべき指摘（`should`）: `try` → `while` → `for` → `if` → `if` の 5 段で、「読み取り」「行の分解」「イベントごとの処理」が 1 か所に重なっている。イベントごとの処理を `handleSseEvent(event, data)` に切り出せば、ループは「1 行ずつ読んで渡す」だけになる。

## if/else の並び順

目安は「肯定形を先に」「単純なほうを先に」「目を引くほうを先に」。ただし互いに衝突するので、機械的に当てはめない。

- 指摘するのは、`if (!x) { 長い処理 } else { 短い処理 }` のように、否定形が先にあり、しかも入れ替えると明らかに読みやすくなる場合だけ（`optional`）。
- エラー・null・権限なしを先に処理するガード節は、否定形でも先に置くのが正しい。指摘しない。

## 三項演算子

三項演算子に関する指摘（ネスト、分岐の中の計算や即時実行関数）は、このファイルの観点として 1 件にまとめる。[compression.md](compression.md) から重ねて出さない。

- 単純な二択の値（`isDark ? "dark" : "light"`）には良い。指摘しない。
- 指摘するのは次の場合（`should`）。
  - ネストした三項演算子
  - 片方または両方の分岐に計算・関数呼び出し・即時実行関数が入っているもの
- JSX の条件付きレンダリングは、2 択（`cond ? <A /> : <B />`）なら問題ない。「読み込み中 / 空 / 一覧」のように 3 状態以上を三項演算子でつないでいるものは、小さなコンポーネントに切り出して早期 `return` で書くよう提案する。`no-nested-ternary` が有効でも、最後の分岐がおおむね 20 行以上あるなら、コンポーネントの切り出しとして指摘してよい（lint は切り出しまでは提案しない）。
- 切り出しを提案するときは、元の分岐が扱っている状態をすべて数え、切り出し後も同じ動作になる形で書く。暗黙に最後の分岐へ流れ込んでいる状態（`undefined` など）を見落とさない。

### 例（作者自身のプロジェクトより）

```tsx
// features/assets/components/asset-table.tsx
{loadingId === asset.id ? (
  <p>{t("loading")}</p>
) : transactionsMap[asset.id]?.length === 0 ? (
  <p>{t("table.noTransactions")}</p>
) : (
  <div className="overflow-x-auto"> ...（数十行のテーブル） </div>
)}
```

ここで出すべき指摘（`should`）: 三項演算子がつながり、最後の分岐が数十行ある。状態は「読み込み中」「0 件」「一覧」に加えて、まだ取得していない `undefined` が最後の分岐に流れ込み、ヘッダーだけの空のテーブルになる、の 4 つ。`<TransactionList assetId=... />` に切り出し、中で状態ごとに早期 `return` する。`undefined` のときの表示を変えるかどうかは作者に確認する。

## 実行の流れを追えるか

コールバック、イベントハンドラ、Promise は「次に何が実行されるか」を見えにくくする。

- コールバックの入れ子や `.then()` の連鎖で処理が順番に進むものは、`async/await` で上から下へ書くよう提案する（`should`）。
- 次は指摘しない。
  - `Promise.all` の中で、各 Promise に `.then()` を付けて、終わったものから個別に処理しているもの。1 つずつ `await` する形に直すと並列性が失われる。async の即時実行関数に包んでも動作は保てるが、読みやすさはほとんど変わらない
  - React の `useEffect` やイベントハンドラなど、フレームワークがコールバックを要求しているもの

### 例（作者自身のプロジェクトより、指摘しないケース）

```ts
// app/api/ai-analysis/route.ts
const [result1, result2, quote] = await Promise.all([
  generateText({ ... }).then((r) => {
    controller.enqueue(sseEvent("agent1_done", ...)); // 終わった時点ですぐ送る
    return r;
  }),
  generateText({ ... }).then((r) => { ... }),
  yf.quote(symbol).catch(() => null),
]);
```

2 つのエージェントを並列に走らせ、先に終わったほうから画面に送るための `.then()`。指摘しない。

## その他

- `do/while` は TS/JS ではまれ。見つけたら、本体が必ず 1 回実行されることで空の入力（`null`、空配列）を壊さないかを確認し、壊すなら `must`、壊さないなら `while` への書き換えを `optional` で提案する。
- ラベル付きの `break` / `continue` は、ネストしたループを一気に抜ける以外の用途なら指摘する（`should`）。関数に切り出して `return` するほうが読みやすいことが多い。
- 条件式の左右（`10 <= length` か `length >= 10` か）は、変化する値を左に置くのが自然。ESLint の `yoda` の範囲なので、lint との分担に従う。
