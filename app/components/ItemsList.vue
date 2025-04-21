<script lang="ts" setup>
  import type { ListProps } from "~~/types/props";

  const props = withDefaults(
    defineProps<
      ListProps<Item> & {
        filter?: {
          name?: string;
          brands?: string[] | string;
          categories?: string[] | string;
        };
        sort?: {
          by: "name" | "created_at" | "brand" | "category"; // Add category sort option
          order: boolean;
        };
      }
    >(),
    {
      filter: () => ({
        name: "",
        brands: [],
        categories: [],
      }),
      sort: () => ({
        by: "name",
        order: true,
      }),
    },
  );

  // Filter and sort items based on props
  const outputItems = computed(() => {
    const filtered = useFilter(props.items, props.filter);
    return useSort(filtered, props.sort);
  });
</script>

<template>
  <div
    v-if="status === 'error'"
    class="text-center"
    data-testid="items-list-error"
  >
    <p>Error: {{ error }}</p>
  </div>

  <BaseGrid
    v-else-if="status === 'pending'"
    data-testid="items-list-loading"
  >
    <USkeleton
      v-for="(_, idx) in Array.from({ length: 5 })"
      :key="idx"
      class="min-h-32"
    />
  </BaseGrid>

  <BaseGrid
    v-else-if="outputItems.length"
    data-testid="items-list-grid"
  >
    <UCard
      v-for="(item, idx) in outputItems"
      :key="idx"
      variant="subtle"
      class="min-h-32 flex flex-col justify-between"
      data-testid="item-card"
    >
      <template #header>
        <NuxtLink :href="`/items/${item.slug}`">
          <h3 class="text-lg font-bold">{{ item.name }}</h3>
        </NuxtLink>
      </template>
      <template #footer>
        <p
          v-if="item.created_at"
          class="text-sm"
        >
          Created {{ new Date(item.created_at || "").toLocaleDateString() }}
        </p>
      </template>
    </UCard>
  </BaseGrid>

  <div
    v-else
    class="text-center"
    data-testid="items-list-empty"
  >
    <p>No items found</p>
  </div>
</template>
