<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="flex justify-between">
      <div class="space-y-4 mb-8">
        <h1 class="text-4xl font-bold">Welcome to MyStore</h1>
        <p class="text-muted-foreground">Discover our amazing products.</p>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="layout = 'grid'"
          :class="[
            'p-2 rounded-md transition-colors hover:bg-gray-200',
            {
              'bg-gray-300 text-black ring-2 ring-gray-400': layout === 'grid',
            },
          ]"
          aria-label="Ubah ke tampilan grid"
          title="Tampilan Grid"
        >
          <LayoutGrid class="h-5 w-5" />
        </button>

        <button
          @click="layout = 'list'"
          :class="[
            'p-2 rounded-md transition-colors hover:bg-gray-200',
            {
              'bg-gray-300 text-black ring-2 ring-gray-400': layout === 'list',
            },
          ]"
          aria-label="Ubah ke tampilan list"
          title="Tampilan List"
        >
          <List class="h-5 w-5" />
        </button>
      </div>
    </div>

    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        v-for="n in 6"
        :key="n"
        class="border rounded-lg p-4 bg-gray-100 animate-pulse"
      >
        <div class="w-full h-48 bg-gray-300 rounded-md mb-4"></div>
        <div class="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div class="h-8 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>

    <div
      v-else-if="error"
      class="text-center py-10 bg-red-50 border border-red-200 rounded-lg"
    >
      <p class="text-red-600 font-semibold">
        Oops! Terjadi kesalahan saat memuat produk.
      </p>
      <p class="text-red-500 mt-2">{{ error.message }}</p>
      <button
        @click="handleRefresh"
        class="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Coba Lagi
      </button>
    </div>

    <div
      v-else-if="products.length === 0"
      class="text-center py-10 bg-gray-50 border rounded-lg"
    >
      <p class="text-gray-600 font-semibold">
        Yah, belum ada produk yang tersedia saat ini.
      </p>
      <p class="text-gray-500 mt-2">Silakan cek kembali nanti.</p>
    </div>

    <div v-else>
      <div
        :class="{
          'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6':
            layout === 'grid',
          'flex flex-col gap-4': layout === 'list',
        }"
      >
        <div v-for="product in products" :key="product.id">
          <ProductCard
            :product="product"
            :layout="layout"
            @add-to-cart="handleAddToCart"
            @view-detail="handleViewDetail"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProductCard from "~/components/product/ProductCard.vue";
import { LayoutGrid, List } from "lucide-vue-next";
const router = useRouter();

const productStore = useProductStore();
const cartStore = useCartStore();

const layout = ref<"grid" | "list">("grid");

const { pending, error, refresh } = useAsyncData("allProducts", async () => {
  await productStore.fetchProductsList({ page: 1, limit: 12 });
});

const products = computed(() => productStore.products);

useHead({
  title: "MyStore - Welcome!",
  meta: [
    {
      name: "description",
      content:
        "Discover our amazing products at MyStore. Find the best deals and quality items.",
    },
    {
      property: "og:title",
      content: "MyStore - Toko Online Terbaik",
    },
    {
      property: "og:description",
      content:
        "Temukan beragam produk menarik dengan penawaran terbaik hanya di MyStore. Belanja mudah, aman, dan cepat!",
    },
    {
      property: "og:image",
      content: "https://localhost:3000/favicon.ico",
    },
    {
      property: "og:url",
      content: "https://localhost:3000/",
    },
    {
      property: "og:type",
      content: "website",
    },
  ],
});

const handleAddToCart = (data: any) => {
  cartStore.addItem(data);

  alert(`${data.product.name} telah ditambahkan ke keranjang!`);
};

const handleViewDetail = (id: number) => {
  router.push(`/product/${id}`);
};

const handleRefresh = () => {
  refresh();
};
</script>
