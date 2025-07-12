<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <ProductDetailSkeleton v-if="pending" />

    <div v-else-if="product" class="space-y-12">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <div class="aspect-square overflow-hidden rounded-lg border">
          <NuxtImg
            :src="product.image || 'https://placehold.co/600x600?text=No+Image'"
            :alt="product.name"
            class="h-full w-full object-cover"
            width="589"
            height="589"
            format="webp"
            loading="lazy"
          />
        </div>

        <div class="space-y-6">
          <div class="space-y-2">
            <h1 class="text-3xl font-bold tracking-tight">
              {{ product.name }}
            </h1>
            <p class="text-3xl font-semibold text-gray-900">
              {{ formatPrice(product.price) }}
            </p>
          </div>

          <div
            v-if="product.variants && product.variants.length > 0"
            class="space-y-4"
          >
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">Varian</span>
              <span class="text-sm text-muted-foreground">
                {{ selectedVariant?.name || "Pilih satu varian" }}
              </span>
            </div>
            <div class="grid grid-cols-4 gap-2">
              <Button
                v-for="variant in product.variants"
                :key="variant.id"
                variant="outline"
                :disabled="variant.stock <= 0"
                :class="{
                  'ring-2 ring-primary': selectedVariant?.id === variant.id,
                }"
                @click="selectedVariant = variant"
              >
                {{ variant.name }}
              </Button>
            </div>
          </div>

          <Button
            class="w-full"
            size="lg"
            :disabled="
              product.variants &&
              product.variants.length > 0 &&
              !selectedVariant
            "
            @click="handleAddToCart"
          >
            Tambah ke Keranjang
          </Button>
        </div>
      </div>

      <ReviewProduct :product-id="product.id" />
      <RecomendationProducts :exclude-id="product.id" />
    </div>

    <div v-else-if="error" class="text-center py-16">
      <h2 class="text-xl font-semibold text-red-600">Produk tidak ditemukan</h2>
      <p class="text-gray-500">
        Maaf, kami tidak dapat menemukan produk yang Anda cari.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Variant, Product } from "~/types";
import Button from "~/components/ui/button/Button.vue";
import ReviewProduct from "~/components/product/ReviewProduct.vue";
import RecomendationProducts from "~/components/product/RecomendationProducts.vue";
import ProductDetailSkeleton from "~/components/product/ProductDetailSkeleton.vue";
import { useCartStore } from "~/stores/cart";

const route = useRoute();
const cartStore = useCartStore();

const productId = Number(route.params.id);

const {
  data: product,
  pending,
  error,
} = await useAsyncData(
  `product-${productId}`,
  async () => {
    const products = (await import("~/public/data/products.json").then(
      (m) => m.default
    )) as Product[];
    return products.find((p) => p.id === productId);
  },
  { lazy: true }
);

const selectedVariant = ref<Variant | null>(null);

const handleAddToCart = () => {
  if (!product.value) return;

  if (
    product.value.variants &&
    product.value.variants.length > 0 &&
    !selectedVariant.value
  ) {
    alert("Silakan pilih varian terlebih dahulu.");
    return;
  }

  cartStore.addItem({
    product: product.value,
    selectedVariant: selectedVariant.value!,
  });

  alert(`${product.value.name} telah ditambahkan ke keranjang!`);
};

watch(
  product,
  (newProduct) => {
    if (newProduct) {
      const title = `${newProduct.name} - MyStore`;
      const description = `Beli ${
        newProduct.name
      } sekarang dengan harga ${formatPrice(
        newProduct.price
      )}. Kualitas terjamin hanya di MyStore.`;

      useSeoMeta({
        title: title,
        description: description,
        ogTitle: title,
        ogDescription: description,
        ogImage: newProduct.image,
        ogUrl: `https://domain-anda.com${route.path}`,
        twitterCard: "summary_large_image",
      });

      useHead({ title });
    }
  },
  { immediate: true }
);
</script>
