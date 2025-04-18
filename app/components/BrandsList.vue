<script lang="ts" setup>
import { USkeleton } from "#components";
import { useSorted } from "@vueuse/core";
import type { Brand } from "~~/server/utils/db";

const props = defineProps<{
  items: Brand[];
  error: string | null;
  status: "success" | "pending" | "error";

  filter?: { name: string };
  sort?: { by: "name" | "created_at"; order: boolean };
}>();

const filteredItems = computed(() => {
  if (!props.filter?.name) return props.items;

  const search = props.filter.name.toLowerCase();
  return props.items.filter((item) => item.name.toLowerCase().includes(search));
});

const sortedItems = useSorted(filteredItems, (a, b) => {
  const order = props.sort?.order ? 1 : -1;

  switch (props.sort?.by) {
    case "name":
      return a.name.localeCompare(b.name) * order;
    case "created_at":
      const aDate = new Date(a.created_at || 0);
      const bDate = new Date(b.created_at || 0);
      return (aDate.getTime() - bDate.getTime()) * order;
    default:
      return 0;
  }
});
</script>

<template>
  <div
    v-if="status === 'error'"
    class="text-center"
  >
    <p>Error: {{ error }}</p>
  </div>

  <Grid v-else-if="status === 'pending'">
    <USkeleton
      v-for="(item, index) in Array.from({ length: 5 })"
      :key="index"
      class="h-48"
    />
  </Grid>

  <Grid v-else-if="sortedItems.length">
    <BrandCard
      v-for="(item, index) in sortedItems"
      :item="item"
      :key="item.id"
      class="min-h-48"
    />
  </Grid>

  <div
    v-else
    class="text-center"
  >
    <p>No brands found</p>
  </div>
</template>
