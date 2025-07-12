<template>
  <div class="mt-10">
    <div>
      <p class="text-3xl font-bold mb-4">Ulasan Pembeli</p>
    </div>
    <div>
      <ScrollArea ref="scrollComponent" class="h-96 border rounded-2xl p-4">
        <div v-for="review in reviews" :key="review.id">
          <div class="flex gap-1 mb-2">
            <LucideStar
              v-for="i in review.rating"
              :key="`filled-${i}`"
              :size="16"
              color="#FFD45F"
            />
            <LucideStarOff
              v-for="i in 5 - review.rating"
              :key="`off-${i}`"
              :size="16"
              color="#c7c7c7"
            />
          </div>
          <div class="flex gap-2 items-center">
            <Avatar>
              <AvatarImage
                :src="review.avatar.includes('/') ? review.avatar : ''"
                :alt="review.author"
              />
              <AvatarFallback>{{
                review.author.charAt(0).toUpperCase()
              }}</AvatarFallback>
            </Avatar>
            <span class="font-semibold">{{ review.author }}</span>
          </div>
          <div class="flex flex-col mt-2">
            <p class="text-[#696969] text-sm mb-1">
              Varian: {{ review.variant }}
            </p>
            <p>{{ review.comment }}</p>
          </div>
          <Separator class="my-3" />
        </div>
        <div v-if="loading" class="text-center py-4">
          Memuat ulasan lainnya...
        </div>
        <div ref="observerEl" />
        <div
          v-if="!hasMore && reviews.length > 0"
          class="text-center py-4 text-gray-500"
        >
          Semua ulasan telah ditampilkan.
        </div>
        <div v-if="error" class="text-center py-4 text-red-500">
          Gagal memuat ulasan.
        </div>
      </ScrollArea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import type { Review } from "~/types";
import ScrollArea from "~/components/ui/scroll-area/ScrollArea.vue";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Separator } from "~/components/ui/separator";
import { LucideStar, LucideStarOff } from "lucide-vue-next";

const props = defineProps<{
  productId: number;
}>();

const scrollComponent = ref<InstanceType<typeof ScrollArea> | null>(null);
const observerEl = ref<HTMLElement | null>(null);

const reviews = ref<Review[]>([]);
const page = ref(1);
const loading = ref(false);
const hasMore = ref(true);
const error = ref<any>(null);

let observer: IntersectionObserver | null = null;

async function loadMore() {
  if (loading.value || !hasMore.value) return;
  loading.value = true;
  error.value = null;
  try {
    await sleep(1000);
    const response = await $fetch<{ reviews: Review[]; hasMore: boolean }>(
      `/api/reviews/${props.productId}`,
      { params: { page: page.value, limit: 5 } }
    );
    reviews.value.push(...response.reviews);
    hasMore.value = response.hasMore;
    page.value++;
  } catch (err) {
    error.value = err;
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  if (observerEl.value && scrollComponent.value?.$el) {
    observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting) {
          loadMore();
        }
      },
      {
        root: scrollComponent.value.$el,
        rootMargin: "0px 0px 100px 0px",
        threshold: 0.1,
      }
    );

    observer.observe(observerEl.value);
  }

  loadMore();
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});
</script>
