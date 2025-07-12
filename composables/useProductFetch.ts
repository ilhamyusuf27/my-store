import { useAsyncData } from "#imports";
import type { Product } from "~/types";

// Tipe data untuk parameter
interface FetchParams {
  page: number;
  limit: number;
}

export const useProductFetch = (params: FetchParams) => {
  const { data, pending, error } = useAsyncData<Product[]>(
    `products-${params.page}-${params.limit}`,
    async () => {
      console.log(
        `Fetching products for page: ${params.page}, limit: ${params.limit}`
      );

      const response = await $fetch("/api/products", {
        params: {
          page: params.page,
          limit: params.limit,
        },
      });
      return response as Product[];
    }
  );
  return {
    products: data,
    pending,
    error,
  };
};
