<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";

type Variant = { id: number; name: string; stock: number };

export interface ProductInterface {
  id: number;
  name: string;
  price: number;
  image: string;
  discount?: number;
  variants?: Variant[];
}

interface Props {
  product: ProductInterface;
  showDiscount?: boolean;
  layout?: "grid" | "list";
  lazy?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showDiscount: true,
  layout: "grid",
  lazy: true,
});

const selectedVariant = ref<Variant | null>(null);

const emit = defineEmits<{
  (
    e: "add-to-cart",
    payload: { product: ProductInterface; selectedVariant: Variant | null }
  ): void;
  (e: "view-detail", id: number): void;
}>();

const discountedPrice = computed<number>(() => {
  if (props.product.discount && props.product.discount > 0) {
    return props.product.price * (1 - props.product.discount / 100);
  }
  return props.product.price;
});

const formattedOriginalPrice = computed(() => formatPrice(props.product.price));
const formattedFinalPrice = computed(() => formatPrice(discountedPrice.value));

const isAddToCartDisabled = computed(() => {
  return (
    props.product.variants &&
    props.product.variants.length > 0 &&
    !selectedVariant.value
  );
});

const selectVariant = (variant: Variant) => {
  if (variant.stock <= 0) return;

  if (selectedVariant.value?.id === variant.id) {
    selectedVariant.value = null;
  } else {
    selectedVariant.value = variant;
  }
};

const handleAddToCart = () => {
  if (isAddToCartDisabled.value) return;

  emit("add-to-cart", {
    product: props.product,
    selectedVariant: selectedVariant.value,
  });
  selectedVariant.value = null;
};

const handleViewDetail = () => {
  emit("view-detail", props.product.id);
};

watch(
  () => props.product,
  () => {
    selectedVariant.value = null;
  }
);

const cardRef = ref<HTMLElement | null>(null);
const isVisible = ref(!props.lazy);
let observer: IntersectionObserver | null = null;
onMounted(() => {
  if (props.lazy && cardRef.value) {
    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          isVisible.value = true;
          observer?.disconnect();
        }
      },
      { rootMargin: "100px" }
    );
    observer.observe(cardRef.value);
  }
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});
</script>

<template>
  <div class="product-card-container" ref="cardRef">
    <article
      v-if="isVisible"
      :class="['product-card', layout]"
      @click="handleViewDetail"
      aria-label="`Lihat detail untuk ${product.name}`"
    >
      <div class="card-image-wrapper">
        <NuxtImg
          :src="product.image"
          :alt="`Gambar ${product.name}`"
          class="product-image"
          width="300"
          height="200"
          loading="lazy"
          format="webp"
        />
        <span v-if="showDiscount && product.discount" class="discount-badge">
          {{ product.discount }}% OFF
        </span>
      </div>
      <div class="card-content">
        <h3 class="product-name">{{ product.name }}</h3>
        <div class="price-section">
          <span v-if="product.discount" class="original-price">{{
            formattedOriginalPrice
          }}</span>
          <span class="final-price">{{ formattedFinalPrice }}</span>
        </div>

        <div
          v-if="product.variants && product.variants.length > 0"
          class="variants-section"
        >
          <button
            v-for="variant in product.variants"
            :key="variant.id"
            @click.stop="selectVariant(variant)"
            class="variant-button"
            :class="{
              selected: selectedVariant?.id === variant.id,
              'out-of-stock': variant.stock <= 0,
            }"
            :disabled="variant.stock <= 0"
            :title="variant.stock <= 0 ? 'Stok habis' : `Pilih ${variant.name}`"
          >
            {{ variant.name }}
          </button>
        </div>

        <button
          @click.stop="handleAddToCart"
          class="add-to-cart-btn"
          :disabled="isAddToCartDisabled"
        >
          Tambah ke Keranjang
        </button>
      </div>
    </article>

    <div v-else :class="['card-placeholder', layout]" aria-hidden="true"></div>
  </div>
</template>

<style scoped>
:root,
.product-card-container {
  --card-bg-color: #ffffff;
  --card-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  --card-border-radius: 12px;
  --primary-color: #000000;
  --primary-color-hover: rgba(0, 0, 0, 0.8);
  --text-color-primary: #333;
  --text-color-secondary: #777;
  --discount-bg: #d0021b;
  --placeholder-bg: #e0e0e0;
}

.product-card-container {
  width: 100%;
  transition: all 0.3s ease;
}

.product-card {
  background-color: var(--card-bg-color);
  border-radius: var(--card-border-radius);
  box-shadow: var(--card-shadow);
  overflow: hidden;
  display: flex;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.product-card.grid {
  flex-direction: column;
}

.product-card.list {
  flex-direction: row;
  align-items: center;
}

.card-image-wrapper {
  position: relative;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.grid .card-image-wrapper {
  width: 100%;
  height: 200px;
}

.list .card-image-wrapper {
  width: 150px;
  height: 150px;
  flex-shrink: 0;
}

.discount-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: var(--discount-bg);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
}

.card-content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.product-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-color-primary);
  margin: 0 0 0.5rem;
  line-height: 1.3;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.original-price {
  font-size: 0.9rem;
  color: var(--text-color-secondary);
  text-decoration: line-through;
}

.final-price {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--primary-color);
}

.variants-section {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.variant-button {
  background-color: #f0f0f0;
  color: var(--text-color-secondary);
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.8rem;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.variant-button:hover:not(:disabled) {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.variant-button.selected {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.variant-button.out-of-stock {
  text-decoration: line-through;
  opacity: 0.6;
  cursor: not-allowed;
  background-color: #f5f5f5;
  color: #b0b0b0;
}

.add-to-cart-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.add-to-cart-btn {
  margin-top: auto;
  width: 100%;
  padding: 0.75rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.add-to-cart-btn:hover {
  background-color: var(--primary-color-hover);
}

.card-placeholder {
  background-color: var(--card-bg-color);
  border-radius: var(--card-border-radius);
  box-shadow: var(--card-shadow);
  overflow: hidden;
  display: flex;
}
.card-placeholder.grid {
  flex-direction: column;
}
.card-placeholder.list {
  flex-direction: row;
  height: 150px;
}
.placeholder-image {
  background-color: var(--placeholder-bg);
}
.grid .placeholder-image {
  width: 100%;
  height: 200px;
}
.list .placeholder-image {
  width: 150px;
  height: 150px;
}
.placeholder-content {
  padding: 1rem;
  flex-grow: 1;
}
.placeholder-line {
  background-color: var(--placeholder-bg);
  border-radius: 4px;
  margin-bottom: 0.75rem;
  animation: pulse 1.5s infinite ease-in-out;
}
.placeholder-line.title {
  width: 80%;
  height: 24px;
}
.placeholder-line.price {
  width: 50%;
  height: 20px;
}
.placeholder-line.button {
  width: 100%;
  height: 48px;
  margin-top: 1rem;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@media (max-width: 600px) {
  .product-card.list,
  .card-placeholder.list {
    flex-direction: column;
    height: auto;
  }
  .list .card-image-wrapper,
  .list .placeholder-image {
    width: 100%;
    height: 180px;
  }
}
</style>
