import productsData from "~/public/data/products.json";
import type { Product } from "~/types";

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const page = parseInt(query.page as string) || 1;
  const limit = parseInt(query.limit as string) || 12;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedProducts = (productsData as Product[]).slice(
    startIndex,
    endIndex
  );

  return paginatedProducts;
});
