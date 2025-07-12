<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div class="space-y-4">
      <Skeleton class="aspect-square rounded-lg" />
      <div class="grid grid-cols-4 gap-4">
        <Skeleton class="aspect-square rounded-lg" />
        <Skeleton class="aspect-square rounded-lg" />
        <Skeleton class="aspect-square rounded-lg" />
        <Skeleton class="aspect-square rounded-lg" />
      </div>
    </div>

    <div class="space-y-6">
      <div class="space-y-3">
        <Skeleton class="h-8 w-3/4" />
        <Skeleton class="h-7 w-1/2" />
      </div>

      <div class="space-y-2">
        <Skeleton class="h-4 w-full" />
        <Skeleton class="h-4 w-full" />
        <Skeleton class="h-4 w-5/6" />
      </div>

      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <Skeleton class="h-5 w-16" />
        </div>
        <div class="flex gap-2">
          <Skeleton class="h-10 w-10 rounded-full" />
          <Skeleton class="h-10 w-10 rounded-full" />
          <Skeleton class="h-10 w-10 rounded-full" />
        </div>
      </div>

      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <Skeleton class="h-5 w-12" />
        </div>
        <div class="flex gap-2">
          <Skeleton class="h-10 w-20" />
          <Skeleton class="h-10 w-20" />
          <Skeleton class="h-10 w-20" />
        </div>
      </div>

      <Skeleton class="h-12 w-full" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Skeleton } from "~/components/ui/skeleton";
</script>
