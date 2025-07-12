import { defineStore } from "pinia";
import type { CartItem, AddToCartPayload } from "~/types";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [] as CartItem[],
  }),

  getters: {
    totalItems: (state): number => {
      return state.items.reduce((total, item) => total + item.quantity, 0);
    },
    totalPrice: (state): string => {
      const total = state.items.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(total);
    },
  },

  actions: {
    addItem(payload: AddToCartPayload) {
      const { product, selectedVariant } = payload;

      const existingItem = this.items.find((item) => {
        if (item.selectedVariant && selectedVariant) {
          return (
            item.productId === product.id &&
            item.selectedVariant.id === selectedVariant.id
          );
        }
        if (!item.selectedVariant && !selectedVariant) {
          return item.productId === product.id;
        }
        return false;
      });

      if (existingItem) {
        existingItem.quantity++;
      } else {
        const finalPrice =
          product.discount && product.discount > 0
            ? product.price * (1 - product.discount / 100)
            : product.price;

        const newItem: CartItem = {
          cartId: crypto.randomUUID(),
          productId: product.id,
          name: product.name,
          price: finalPrice,
          originalPrice: product.price,
          discount: product.discount,
          image: product.image,
          quantity: 1,
          selectedVariant: selectedVariant,
        };
        this.items.push(newItem);
      }
    },

    removeItem(cartId: string) {
      this.items = this.items.filter((item) => item.cartId !== cartId);
    },

    updateQuantity(cartId: string, newQuantity: number) {
      const itemIndex = this.items.findIndex((item) => item.cartId === cartId);
      if (itemIndex === -1) return;

      if (!newQuantity || newQuantity < 1) {
        this.removeItem(cartId);
        return;
      }

      const newItems = [...this.items];

      const updatedItem = { ...newItems[itemIndex] };

      newItems[itemIndex] = { ...updatedItem, quantity: newQuantity };

      this.items = newItems;
    },

    clearCart() {
      this.items = [];
    },
  },

  persist: true,
});
