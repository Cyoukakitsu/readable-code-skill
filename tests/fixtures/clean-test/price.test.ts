import { beforeEach, describe, expect, it } from "vitest";
import { priceWithTax } from "./price";

describe("priceWithTax", () => {
  let price: number;

  beforeEach(() => {
    price = 1000;
  });

  it("10% の税を足す", () => {
    expect(priceWithTax(price)).toBe(1100);
  });

  it("0 円は 0 円のまま", () => {
    expect(priceWithTax(0)).toBe(0);
  });

  it("1 円未満を切り捨てる", () => {
    // 109 × 1.1 = 119.9
    expect(priceWithTax(109)).toBe(119);
  });

  it("端数が出ない価格は切り捨ての影響を受けない", () => {
    expect(priceWithTax(110)).toBe(121);
  });
});
