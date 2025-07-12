import { defineStore } from "pinia";
import { type Product } from "~/types";

export const useProductStore = defineStore("products", {
  state: () => ({
    products: [] as Product[],
    currentProduct: null as Product | null,
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchProductsList({ page = 1, limit = 12 }) {
      this.loading = true;
      this.error = null;
      try {
        const response = await $fetch<Product[]>("/api/products", {
          params: { page, limit },
        });
        this.products = response;
      } catch (e: any) {
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    },
    async fetchProductBySlug(slug: string) {
      this.loading = true;
      this.error = null;
      this.currentProduct = null;
      try {
        const product = await $fetch<Product>(`/api/products/${slug}`);
        this.currentProduct = product;
        return product;
      } catch (e: any) {
        this.error = e.message;
        throw new Error(`Product with slug ${slug} not found.`);
      } finally {
        this.loading = false;
      }
    },
  },
});
