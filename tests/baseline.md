# 基線（スキル変更前）

方式が 2 つある。**現在の基準は「按需読取」。** 「全読み」は最初に取った記録で、参考として残す。

## 按需読取（現在の基準）

`SKILL.md` だけを読み、references は必要と判断したものだけ読ませた。実際の使い方に近い。

| サンプル | 期待項目 | 3 回中 | passes |
|---|---|---|---|
| calc | calc-header-vs-impl（must） | **1/3**（1 回はヘッダーを「净成本法」と誤読） | false |
| calc | calc-sell-cost-name（should） | 2/3（1 回は optional） | false |
| calc | calc-repeated-reduce（should） | **0/3** | false |
| calc | calc-numbered-comments（optional） | 3/3 | true |
| calc | calc-test-title-contradiction（must） | 3/3 | true |
| clean-route | must / should が出ない | 1/1（1 回のみ実行） | true |

- 読まれた references: calc は 3 回とも `comments.md` と `naming.md` のみ。clean-route は 0 件
- **`compression.md` が読まれなかったため、重複求和の指摘が全滅した**（全読みでは 3/3）。`SKILL.md` の案内だけでは、必要な reference を読ませられていない
- トークン: calc 約 5.8 万/回、clean-route 約 4.7 万/回（全読みの約 7.4 万、6.7 万より 2〜3 割減）
- chart-hook は按需読取では未実行。下の「全読み」の記録のまま

## 変更後（このブランチのスキル、按需読取）

`SKILL.md` に references の読み分けの案内と出力前の確認を追加し、`comments.md` にファイル先頭の説明を 1 文ずつ実装と突き合わせる指示、`variables.md` に依存配列の不安定の節を足した。

| サンプル | 期待項目 | 基線 | 変更後 |
|---|---|---|---|
| calc | calc-header-vs-impl（must） | 1/3 | **3/3** |
| calc | calc-sell-cost-name（should） | 2/3 | **3/3** |
| calc | calc-repeated-reduce（should） | 0/3 | **3/3** |
| calc | calc-numbered-comments（optional） | 3/3 | 2/3 |
| calc | calc-test-title-contradiction（must） | 3/3 | 3/3 |
| clean-route | must / should が出ない | 1/1 | 1/1 |

- calc の合計: 基線 9/15 → 変更後 14/15
- 3 回とも `naming.md` / `comments.md` / `compression.md` を読んだ（案内どおり）。clean-route は `defensive-code.md` も読んだ（入力検証があるため）
- calc-numbered-comments が 2/3: 1 回は「要約コメントなので残してよい」と判断して指摘しなかった。optional で、判断の分かれる項目
- トークン: calc 約 6.5 万/回（基線 5.8 万、+11%）、clean-route 約 6.1 万（基線 4.7 万、+31%）。読む references が増えた分。全読み方式（calc 約 7.4 万）よりは少ない
- 未検証: chart-hook は再実行していない。`variables.md` に追加した依存配列の節の効果は、このサンプル集では確かめていない
- 実行回数が少ない（calc 3 回、clean-route 1 回）ので、差は目安として読む

## 全読み（最初の記録）

SKILL.md と references をすべて読ませた。



- 対象: `main`（`3b0bf31`、PR #2 マージ直後）の `readable-code-review`
- 実行: サンプルごとに新しいサブエージェントで 3 回（計 9 回）。期待値は見せていない
- 判定: 3 回すべてで `min_severity` 以上の重要度で出たら `passes: true`

## 結果

| サンプル | 期待項目 | 3 回中 | passes |
|---|---|---|---|
| calc | calc-header-vs-impl（ヘッダー「平均买入价」と実装の食い違い, must） | **1/3** | false |
| calc | calc-sell-cost-name（totalSellCost, should） | 3/3 | true |
| calc | calc-repeated-reduce（4 回重複, should） | 3/3 | true |
| calc | calc-numbered-comments（手順コメント, optional） | 3/3 | true |
| calc | calc-test-title-contradiction（テスト名の矛盾, must） | 3/3 | true |
| chart-hook | hook-unstable-deps（依存配列が毎回変わる, should） | 3/3 | true |
| chart-hook | hook-dead-branch-and-refs（到達しない分岐と未使用 ref, should） | 3/3 | true |
| chart-hook | hook-get-naming（getFromDate, optional） | 3/3 | true |
| chart-hook | hook-duplicate-price-scale（重複, optional） | 3/3 | true |
| chart-hook | hook-return-pct-expression（入れ子の式, optional） | 3/3 | true |
| clean-route | must / should が出ない | 3/3（誤検出 0） | true |

期待項目の命中: 28/30（clean-route を除く）。

## 弱点

**calc-header-vs-impl が 1/3 しか出ない。** 同じファイルに、より目立つ食い違い（テスト名）があると、ファイル先頭のコメントを実装と突き合わせる前に止まってしまう。2 回目は「顶部の文件说明也可以保留」と、食い違っているコメントを良いものとして扱った。

## 期待外だが妥当だった指摘（期待値には入れない）

- `use-portfolio-candlestick-chart.ts`: `getFromDate(range)` が `firstTransactionDate` を渡さないため、`MAX` が常に 2020-01-01 から始まる（3 回すべてで指摘。作者の意図確認が必要）
- `calculations.ts`: 利益が出る売却で `total_cost` / `avg_price` が負になりうる（1 回）
- `clean-route/route.ts`: `getAuthSession` の `get`（optional・unverified、2 回）

## 良かった点

- 作者の意図が決められない食い違いで、実装側かテスト側かを勝手に決めず、2 つの可能性と判断材料を示した（calc の 3 回すべて）
- 信頼境界の検証を不要な防御として指摘しなかった（clean-route の 3 回すべて）
- 他ファイルに波及する改名は、確認を促すだけで適用しなかった

## 注意

- 期待値は同じモデルによる過去のレビューから作った。独立した正解ではない
- 出力はぶれる。3 回で 3/3 でも、次の 3 回で変わりうる
