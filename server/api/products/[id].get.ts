import productsData from "~/public/data/products.json";
import type { Product } from "~/types";

export default defineEventHandler((event) => {
  const id = getRouterParam(event, "id");

  const product = (productsData as Product[]).find((p) => p.id === Number(id));

  if (!product) {
    throw createError({
      statusCode: 404,
      statusMessage: "Product not found",
    });
  }

  return product;
});
