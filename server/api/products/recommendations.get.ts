import productsData from "~/public/data/products.json";
import type { Product } from "~/types";

const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default defineEventHandler((event) => {
  const query = getQuery(event);

  const excludeId = parseInt(query.excludeId as string);
  const limit = parseInt(query.limit as string) || 4;

  const availableProducts = !isNaN(excludeId)
    ? (productsData as Product[]).filter((p) => p.id !== excludeId)
    : (productsData as Product[]);

  const shuffledProducts = shuffleArray(availableProducts);

  return shuffledProducts.slice(0, limit);
});
