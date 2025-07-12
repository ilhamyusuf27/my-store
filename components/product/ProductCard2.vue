<template>
  <Card
    class="w-full max-w-sm rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 p-0"
  >
    <CardHeader class="p-0 relative">
      <img
        :src="props.product.thumbnail"
        :alt="props.product.name"
        class="w-full h-48 object-cover"
        onerror="this.onerror=null;this.src='https://placehold.co/300x200/F3F4F6/1F2937?text=Image+Not+Found';"
      />
      <Badge
        v-if="props.product.discount > 0"
        class="absolute top-2 right-2 bg-red-500 text-white rounded-md px-2 py-1 text-xs font-semibold"
      >
        {{ props.product.discount }}% OFF
      </Badge>
    </CardHeader>

    <CardContent class="px-4 space-y-2">
      <CardTitle
        class="text-lg font-semibold text-gray-800 line-clamp-2 min-h-[30px] mb-0"
      >
        {{ props.product.name }}
      </CardTitle>
      <div class="flex items-baseline space-x-2">
        <p class="text-xl font-bold text-gray-900">
          {{
            formatCurrency(
              props.product.discount > 0
                ? calculateDiscount(props.product.price)
                : props.product.price
            )
          }}
        </p>
        <p
          v-if="props.product.discount > 0"
          class="text-sm text-gray-500 line-through"
        >
          {{ formatCurrency(props.product.price) }}
        </p>
      </div>
      <div class="flex items-center text-sm text-gray-600">
        <span class="text-yellow-400 mr-1">★</span>
        <span>4.5 | 4rb+ terjual</span>
      </div>
      <div class="text-sm text-gray-500 flex items-center gap-1">
        <MapPin :size="16" color="#6A7282" />
        <p>Kota Administrasi Jakarta P</p>
      </div>
    </CardContent>

    <CardFooter class="p-4 pt-0"></CardFooter>
  </Card>
</template>

<script setup lang="ts">
import { type Product } from "~/types";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-vue-next";

const props = defineProps<{
  product: Product;
}>();

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const calculateDiscount = (originalPrice: number) => {
  return originalPrice - (originalPrice * props.product.discount) / 100;
};
</script>
