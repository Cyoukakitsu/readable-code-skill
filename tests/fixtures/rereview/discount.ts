export type CartItem = { unitPrice: number; quantity: number };

const MEMBER_DISCOUNT_RATE = 0.05;

export function calculateCartTotal(items: CartItem[], isMember: boolean): number {
  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );
  const discount = isMember ? subtotal * MEMBER_DISCOUNT_RATE : 0;
  return subtotal - discount;
}

export function formatYen(value: number): string {
  return `${value} 円`;
}

export function calcShip(n: number): number {
  return n >= 5000 ? 0 : 500;
}
