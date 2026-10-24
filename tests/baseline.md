# 基線（スキル変更前）

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
