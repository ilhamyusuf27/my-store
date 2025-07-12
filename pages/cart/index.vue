<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-4">Keranjang Belanja</h1>
    <Separator class="mb-4" />

    <ClientOnly>
      <div
        v-if="!cartStore.items || cartStore.items.length === 0"
        class="text-center py-16"
      >
        <p class="text-gray-500">Keranjang kamu kosong.</p>
      </div>

      <div v-else class="flex flex-col lg:flex-row gap-8">
        <div class="flex-1 space-y-6">
          <div
            v-for="item in cartStore.items"
            :key="item.cartId"
            class="flex gap-4 items-start border rounded-lg p-4"
          >
            <NuxtImg
              :src="item.image"
              alt="Product image"
              class="object-cover rounded-md border"
              width="100"
              height="100"
              loading="lazy"
            />
            <div class="space-y-1">
              <h2 class="font-semibold text-lg">{{ item.name }}</h2>
              <p
                v-if="item.selectedVariant"
                class="text-sm text-muted-foreground"
              >
                Varian: {{ item.selectedVariant.name }}
              </p>
              <div class="font-bold">
                <p
                  v-if="item.discount && item.originalPrice"
                  class="text-sm text-gray-500 line-through"
                >
                  {{ formatPrice(item.originalPrice) }}
                </p>
                <p class="">
                  {{ formatPrice(item.price) }}
                </p>
              </div>
              <div class="flex items-center gap-2 mt-2">
                <NumberField
                  id="Quantity"
                  :default-value="item.quantity"
                  @update:model-value="
                    (newValue: number) => handleQuantityChange(item.cartId, newValue)
                  "
                  :min="0"
                >
                  <Label for="Quantity">Quantity</Label>
                  <NumberFieldContent>
                    <NumberFieldDecrement />
                    <NumberFieldInput />
                    <NumberFieldIncrement />
                  </NumberFieldContent>
                </NumberField>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              @click="cartStore.removeItem(item.cartId)"
              class="ml-auto"
            >
              <Trash2 class="w-5 h-5 text-red-500" />
            </Button>
          </div>
        </div>

        <div class="lg:w-1/3 border rounded-lg p-4 space-y-4 h-fit">
          <h2 class="text-lg font-semibold">Ringkasan Belanja</h2>
          <Separator />
          <div class="flex justify-between text-base">
            <span>Total</span>
            <span class="font-bold">{{ cartStore.totalPrice }}</span>
          </div>
          <Button class="w-full">Lanjut ke Checkout</Button>
        </div>
      </div>

      <template #fallback>
        <div class="text-center py-16">
          <p class="text-gray-500">Memuat keranjang...</p>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash2 } from "lucide-vue-next";
import { useCartStore } from "~/stores/cart";
import { Label } from "@/components/ui/label";
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/components/ui/number-field";

const cartStore = useCartStore();

const handleQuantityChange = (cartId: string, quantity: number) => {
  if (!isNaN(quantity)) {
    cartStore.updateQuantity(cartId, quantity);
  }
};
</script>
