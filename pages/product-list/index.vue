<template>
  <div class="products">
    <div v-if="pending">
      <p>Loading products...</p>
    </div>
    <div v-else-if="error">
      <p>Error loading products: {{ error.message }}</p>
    </div>
    <div v-else>
      <ProductCard
        v-for="item in products"
        :key="item.id"
        :product="item"
        @add-to-cart="handleAddToCart"
        @view-detail="handleViewDetail"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProductFetch } from "~/composables/useProductFetch";
import ProductCard from "~/components/product/ProductCard.vue";

const cartStore = useCartStore();
const router = useRouter();

const { products, pending, error } = useProductFetch({ page: 1, limit: 10 });

const handleAddToCart = (product: any) => {
  cartStore.addItem(product);
  alert(`${product.name} added to cart!`);
};

const handleViewDetail = (id: number) => {
  router.push(`/product/${id}`);
};
</script>
