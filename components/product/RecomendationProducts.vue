<template>
  <div ref="rootEl" class="mt-10">
    <div>
      <p class="text-3xl font-bold mb-4">Pilihan untukmu</p>
    </div>
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      <template v-if="loading">
        <div
          v-for="i in 4"
          :key="`skeleton-${i}`"
          class="border rounded-lg p-3 space-y-3"
        >
          <Skeleton class="aspect-[4/3]" />
          <Skeleton class="h-4 w-3/4" />
          <Skeleton class="h-6 w-1/2" />
        </div>
      </template>

      <template v-else-if="recommendations.length > 0">
        <NuxtLink
          v-for="product in recommendations"
          :key="product.id"
          :to="`/products/${product.id}`"
          class="block relative bg-white rounded-lg border hover:shadow-md transition-shadow duration-200"
        >
          <div class="aspect-[4/3] overflow-hidden">
            <NuxtImg
              :src="product.image"
              :alt="product.name"
              class="h-full w-full object-cover"
              loading="lazy"
              format="webp"
            />
          </div>
          <div class="p-3 space-y-2">
            <h3 class="font-medium line-clamp-2 text-sm">{{ product.name }}</h3>
            <div class="space-y-1">
              <div class="font-bold">
                {{ formatPrice(product.price) }}
              </div>
            </div>
          </div>
        </NuxtLink>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import type { Product } from "~/types";
import { Skeleton } from "~/components/ui/skeleton";

const props = defineProps<{
  excludeId: number;
}>();

const rootEl = ref<HTMLElement | null>(null);
const recommendations = ref<Product[]>([]);
const loading = ref<boolean>(false);
const hasFetched = ref<boolean>(false);

async function fetchRecommendations() {
  if (hasFetched.value) return;

  loading.value = true;
  hasFetched.value = true;

  try {
    const data = await $fetch<Product[]>("/api/products/recommendations", {
      params: {
        excludeId: props.excludeId,
        limit: 4,
      },
    });
    recommendations.value = data;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
}

let observer: IntersectionObserver | null = null;

onMounted(() => {
  if (rootEl.value) {
    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetchRecommendations();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(rootEl.value);
  }
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});
</script>
