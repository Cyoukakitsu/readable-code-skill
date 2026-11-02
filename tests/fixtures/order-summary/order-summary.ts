// 注文データ（外部 API のレスポンス）を、月次の売上サマリーに変換する
import { sendSlackMessage } from "./notify";

type Order = {
  id: string;
  status: "paid" | "cancelled";
  customer: { name: string; email?: string };
  items: { sku: string; price: number; quantity: number }[];
};

export async function buildMonthlySummary(raw: unknown, month: string) {
  const orders = raw as any as Order[];
  const lines: string[] = [];
  let total = 0;

  for (const order of orders) {
    if (order.status === "paid") {
      let orderTotal = 0;
      for (const item of order.items) {
        if (item.quantity > 0) {
          orderTotal += item.price * item.quantity;
        }
      }
      total += orderTotal;
      lines.push(`${order.id}: ${order.customer.name} ${orderTotal} 円`);
      if (orderTotal >= 100000) {
        await sendSlackMessage(`高額注文: ${order.id}`);
      }
    }
  }

  return { month, total, lines };
}

export function primaryEmail(order: Order): string {
  return order.customer.email!.toLowerCase();
}
