const TAX_RATE = 0.1;

// 税込価格は 1 円未満を切り捨てる（経理の計算方法に合わせる）
export function priceWithTax(price: number): number {
  return Math.floor(price * (1 + TAX_RATE));
}
