<template>
  <div class="min-h-screen flex flex-col">
    <header class="border-b flex justify-center">
      <div
        class="container mx-auto px-4 flex h-16 items-center justify-between"
      >
        <NuxtLink to="/" class="font-bold"> MyStore </NuxtLink>

        <nav class="hidden md:flex items-center space-x-6">
          <Button variant="ghost" as-child>
            <NuxtLink to="/cart"><ShoppingCart />Cart</NuxtLink>
          </Button>
        </nav>
      </div>
    </header>

    <main class="py-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ShoppingCart } from "lucide-vue-next";
</script>
