# 巨大な式と詰め込み

原則: 基準は新しい構文か古い構文か、短いか長いかではない。読み手が頭の中でもう一段「翻訳」しなければならないかどうかだ。巨大な式は、名前の付いた小さな部品に分けて、読み手が一度に抱える量を減らす。（第 1・8 章）

短くて明快なもの（単純な `map` や `filter`、オプショナルチェーン）は良い。短いが密度が高すぎるもの、長くて一度に読めないものは良くない。三項演算子の問題は [control-flow.md](control-flow.md) の担当なので、ここでは重ねて出さない。

## 説明変数・要約変数

- **説明変数**: 式の一部が何を表しているのか、読み手が解読しなければならないなら、その部分を変数に取り出して名前で説明する（`should`）。
- **要約変数**: 同じ式が 2 回以上出てくるなら、1 つの概念としてまとめる（`should`）。対象は、演算子を 2 つ以上含む式か、プロパティアクセスが 3 段以上の式。何度も書かれていると、読み手は「どれか 1 つだけ違うのでは」と 1 つずつ見比べることになる。値がループの中で変わるなら、変数ではなく関数にまとめる。

### 名前は意図、式は実装

説明変数・要約変数の名前は「この式が何を意味するか」という意図で、式は実装にあたる。両者がずれていれば、それ自体がバグの手がかりになる。

- 既存の説明変数・要約変数は、名前と式を必ず突き合わせる。名前が約束していることを式が計算していなければ `must`（[naming.md](naming.md) の「名前と中身のずれ」と同じ扱い）。
- 新しい名前を提案するとき（変数名・定数名とも）、その値が業務上何を意味するのか、なぜその数値なのかがコードから確定できなければ、名前は仮とし「意味・根拠は作者が確認」と添える。名前と式を同じ AI が書くと、ずれに気づく仕組みが働かなくなるため。

### 例（作者自身のプロジェクトより）

```ts
// fire-calculator: src/utils/calculateFireResult.ts — 同じ式が 5 回
assets: Math.round(stockBal + bondBal + cashBal + currentSavings),
...
const totalAssets = stockBal + bondBal + cashBal + currentSavings;
...
const currentTotalAssets = stockBal + bondBal + cashBal + currentSavings;
chartData.push({
  assets: Math.round(stockBal + bondBal + cashBal + currentSavings), // 直前の変数を使っていない
  ...
});
...
const finalAssets = stockBal + bondBal + cashBal + currentSavings;
```

ここで出すべき指摘（`should`）: 総資産を求める式が 5 回あり、付いた名前も `totalAssets` / `currentTotalAssets` / `finalAssets` とばらばら。値はループのたびに変わるので、`sumAssets()` のような関数に 1 か所でまとめ、同じ反復の中では計算済みの値を再利用する。

```ts
// fire-calculator: src/components/ResultSection.tsx
const fireProgress =
  totalSpan > 0
    ? Math.min(96, Math.max(4, ((result.fireAge - inputs.currentAge) / totalSpan) * 100))
    : 50;
```

ここで出すべき指摘（`should`）: 割合の計算、端からはみ出さないためのクランプ、ゼロ除算の回避が 1 つの式に入っている。`(result.fireAge - inputs.currentAge)` は 20 行目の `yearsToFire` と同じ。`rawProgressPct` を説明変数として取り出し、`4` / `96`（と関連する 28 行目の `8` / `88`）には仮の名前を付けて、値の根拠は作者に確認する。

## 短絡評価

- **文として使う `&&` / `||`**（`user && notify(user);`）: 副作用が式の中に隠れる。`if` に書き換えるよう提案する（`should`）。Next.js の ESLint 設定では `@typescript-eslint/no-unused-expressions` が検出することが多いので、lint との分担に従う。
- **JSX の `{count && <X />}` で `count` が数値**: HTML 要素の子として描画される位置なら、`0` や `NaN` がそのまま画面に出る。`{count > 0 && <X />}` のように比較を明示する（`must`）。SVG の中や、子要素を選別するライブラリ（Recharts など）の中では表示への影響が限られるので `should`。`react/jsx-no-leaked-render` が有効なら lint に任せる。
- **`||` によるデフォルト値**: まず [defensive-code.md](defensive-code.md) でそのフォールバック自体が必要かを判断する。不要なら削除の指摘だけを出す。必要なら、次に `||` と `??` のどちらが正しいかを見る。
  - JS の `||` は `0`、`""`、`false` も偽として扱う。それらが正当な値になりうるのに `||` を使っていて、正当な値がデフォルト値に置き換わってしまうなら実際のバグなので `must`。正当な値が来ないなら `??` への変更は `optional`。
  - `""` が来うる（`split` の結果、フォーム入力、クエリ文字列）うえに、`""` をそのまま使うと壊れる場合は、`||` が正しい。指摘しない。
- `cn()` / `clsx()` の引数の中の `cond && "class"` は慣用的な書き方で、`0` や `false` は無視される。指摘しない。

### 例（作者自身のプロジェクトより）

```tsx
// fire-calculator: src/components/FireChart.tsx
{targetAmount && (<ReferenceLine y={targetAmount} ... />)}
```

`targetAmount` は `number` で、年間支出が 0 なら `0` が渡る。Recharts の中なので画面への影響は限られるが、条件の意図（何を除外したいのか）が読み取れない。`targetAmount > 0 &&` にする（`should`）。

```ts
// AI-Portfolio-Manager: lib/supabase/middleware.ts（指摘しないケース）
const locale = pathname.split("/")[1] || "ja";
```

パスが `/` のとき `split` の結果は空文字なので、空文字も `"ja"` に置き換えたい。`||` が正しく、`??` にすると `//sign-in` のような壊れたパスになる。

## 否定と複雑な条件

- 全体にかかった否定（`!(a && !b)`）は、ド・モルガンの法則で内側に入れたほうが読みやすければ提案する（`optional`）。
- 関数本体の条件判定で、3 つ以上の `||` / `&&` を並べていて読み解けないものは、当てはまらないケースを先に `return` で除外し、最後に残った条件の結果を返す形に書き直せないか検討する（`should`）。JSX や `className` の計算には当てはめない。

## 兆候（そのほか）

いずれも `should`。元のコードが短く明快なら指摘しない。

- おおむね 5 段以上のメソッドチェーン。特に `filter` / `map` / `reduce` / `flatMap` が混ざり、途中の値に名前がないもの
- JSX の中の即時実行関数（`{(() => { ... })()}`）。計算を描画の前に済ませるか、小さな関数・コンポーネントに切り出す。三項演算子の分岐の中にあるものは control-flow.md の指摘として 1 件にまとめる
- 普通のループなら上から下へ読めるのに、オブジェクトの組み立てや副作用のために使われている `reduce`
- 演算子の優先順位や暗黙の型変換に頼った凝ったワンライナー
- 同じ操作を複数のフィールドに繰り返している数行（`a.x += b.x; a.y += b.y; a.z += b.z;`）。フィールド名の配列とループにまとめられるが、元より読みにくくなるなら提案しない

### 例（作者自身のプロジェクトより）

```tsx
// AI-Portfolio-Manager: features/assets/components/asset-table.tsx
{asset.symbol in currentPrices
  ? (() => {
      const p = Number(currentPrices[asset.symbol]);
      return !isNaN(p) && currentPrices[asset.symbol] != null
        ? `$${p.toFixed(2)}`
        : "—";
    })()
  : t("loading")}
```

ここで出すべき指摘（`should`、三項演算子の観点とまとめて 1 件）: 三項演算子の中に即時実行関数があり、その中にさらに三項演算子がある。読み手は 3 段展開しないと「価格を表示するだけ」だと分からない。`formatPrice(price: number | null): string` に切り出す。あわせて、`currentPrices` は取得時（`use-asset-table.ts`）に `number | null` の型が付いているので、描画側での `Number()` と `isNaN` の再チェックは境界の防御ではない（[defensive-code.md](defensive-code.md)）。検証は取得時の 1 回にまとめるよう提案する。

## 修正案の出し方

- チェーンを分割して途中の結果に名前を付ける（`const activeUsers = ...`）か、普通の `for...of` ループに書き直す。
- すでに短く明快なコードを、チェーンだというだけで分割するよう提案しない。
