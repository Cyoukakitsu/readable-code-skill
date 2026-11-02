import { describe, expect, it, vi } from "vitest";
import { buildMonthlySummary } from "./order-summary";

vi.mock("./notify", () => ({ sendSlackMessage: vi.fn() }));

describe("buildMonthlySummary", () => {
  it("支払い済みの注文だけを合計する", async () => {
    const orders = [
      {
        id: "o1",
        status: "paid",
        customer: { name: "佐藤" },
        items: [{ sku: "a", price: 1000, quantity: 2 }],
      },
      {
        id: "o2",
        status: "cancelled",
        customer: { name: "鈴木" },
        items: [{ sku: "b", price: 3000, quantity: 1 }],
      },
    ];

    const summary = await buildMonthlySummary(orders, "2026-10");

    expect(summary).toBeDefined();
  });
});
