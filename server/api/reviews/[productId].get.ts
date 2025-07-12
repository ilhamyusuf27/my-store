import reviewsData from "~/public/data/reviews.json";
import type { Review } from "~/types";

export default defineEventHandler((event) => {
  const productId = getRouterParam(event, "productId");
  const query = getQuery(event);

  const page = parseInt(query.page as string) || 1;
  const limit = parseInt(query.limit as string) || 5;

  if (!productId || !(reviewsData as any)[productId]) {
    throw createError({
      statusCode: 404,
      statusMessage: "Product reviews not found",
    });
  }

  const productReviews: Review[] = (reviewsData as any)[productId];

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedReviews = productReviews.slice(startIndex, endIndex);

  return {
    reviews: paginatedReviews,
    hasMore: endIndex < productReviews.length,
  };
});
