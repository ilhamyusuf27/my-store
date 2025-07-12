import { describe, it, expect, beforeEach, vi } from "vitest";
import { useProductCart } from "../useProductCart";

describe("useProductCart", () => {
  it("should increment quantity if the product already exists", () => {
    const { items, addItem, totalItems, totalPrice } = useProductCart();
    const product = { id: 1, name: "Product A", price: 50 };

    addItem(product);
    addItem(product, 2);

    expect(items.value.length).toBe(1);
    expect(items.value[0].quantity).toBe(3);
    expect(totalItems.value).toBe(3);
    expect(totalPrice.value).toBe(150);
  });
});
