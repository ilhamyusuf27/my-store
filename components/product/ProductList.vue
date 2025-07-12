<template>
  <div v-if="pending">
    <p>Memuat produk...</p>
  </div>

  <div v-else-if="error">
    <p>Maaf, gagal memuat produk. Silakan coba lagi nanti.</p>
  </div>

  <div v-else-if="products" class="products">
    <NuxtLink
      v-for="item in products"
      :to="`/products/${item.id}`"
      :key="item.id"
      class="flex"
    >
      <NuxtImg
        :src="item.image"
        :alt="item.name"
        width="300"
        height="300"
        loading="lazy"
        format="webp"
      />
      <h3>{{ item.name }}</h3>
      <p>{{ formatPrice(item.price) }}</p>
      <button
        @click.stop="addToCart(item)"
        :disabled="item.variants && item.variants[0].stock === 0"
      >
        Add to Cart
      </button>
    </NuxtLink>
  </div>
</template>
<script setup lang="ts">
import type { Product, AddToCartPayload } from "~/types";

const {
  data: products,
  pending,
  error,
} = useFetch<Product[]>("/api/products", {
  default: () => [],
});

const cartStore = useCartStore();

const addToCart = (product: Product) => {
  const newItem: AddToCartPayload = {
    product,
    selectedVariant: {
      id: 1,
      name: "black",
      stock: 8,
    },
  };
  cartStore.addItem(newItem);
  alert(`${product.name} added to cart!`);
};
</script>
