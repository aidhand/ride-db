<script lang="ts" setup>
import { useSorted } from "@vueuse/core";

const props = defineProps<{
  items: Brand[];
  error: Error | null;
  status: "success" | "error" | "pending";
  filter?: {
    name: string;
  };
  sort?: {
    by: "name" | "created_at";
    order: boolean; // true for ascending, false for descending
  };
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
      const aDate = new Date(a.created_at || "");
      const bDate = new Date(b.created_at || "");
      return (aDate.getTime() - bDate.getTime()) * order;
    default:
      return 0;
  }
});
</script>

<template>
  <div class="flex flex-wrap justify-between gap-8">
    <div
      v-for="item in sortedItems"
      :key="item.id"
      class="min-w-56 text-center"
    >
      <NuxtLink :to="`/brands/${item.slug}`">
        {{ item.name }}
      </NuxtLink>
    </div>
  </div>
</template>
