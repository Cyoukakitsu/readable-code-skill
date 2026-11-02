# 前回のレビュー（1 回目）

must 0 / should 1 / optional 1

### [should] discount.ts:5 — `calc` が何を計算するのか分からない
- 問題: 関数名 `calc` と引数 `b` から、カートの合計を計算していることが読み取れない
- 修正案: `calculateCartTotal(items, isMember)` に改名する

### [optional] discount.ts:18 — `calcShip` の `n` が何か分からない
- 問題: `n` が小計なのか個数なのか読み取れない
- 修正案: `calculateShippingFee(subtotal)` に改名する
- 作者の回答: 見送り。この関数は来週削除する予定なので、今回は直さない

# 修正の差分（2 回目の対象）

```diff
-export function calc(items: CartItem[], b: boolean): number {
+export function calculateCartTotal(items: CartItem[], isMember: boolean): number {
   const subtotal = items.reduce(
     (sum, item) => sum + item.unitPrice * item.quantity,
     0,
   );
-  const discount = b ? subtotal * MEMBER_DISCOUNT_RATE : 0;
+  const discount = isMember ? subtotal * MEMBER_DISCOUNT_RATE : 0;
   return subtotal - discount;
 }
```
