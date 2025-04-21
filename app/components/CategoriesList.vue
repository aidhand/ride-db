<script lang="ts" setup>
  import type { ListProps } from "~~/types/props";

  const props = withDefaults(
    defineProps<
      ListProps<Category> & {
        filter?: {
          name?: string;
        };
        sort?: {
          by: "name" | "created_at";
          order: boolean;
        };
      }
    >(),
    {
      filter: () => ({
        name: "",
      }),
      sort: () => ({
        by: "name",
        order: true,
      }),
    },
  );

  // Filter and sort items based on props
  const outputItems = computed(() => {
    const filteredItems = useFilter(props.items, props.filter);
    return useSort(filteredItems, props.sort);
  });
</script>

<template>
  <div
    v-if="status === 'error'"
    class="text-center"
    data-testid="categories-list-error"
  >
    <p>Error: {{ error }}</p>
  </div>

  <BaseGrid
    v-else-if="status === 'pending'"
    data-testid="categories-list-loading"
  >
    <USkeleton
      v-for="(_, idx) in Array.from({ length: 5 })"
      :key="idx"
      class="min-h-48"
    />
  </BaseGrid>

  <BaseGrid
    v-else-if="outputItems.length"
    data-testid="categories-list-grid"
  >
    <UCard
      v-for="(category, idx) in outputItems"
      :key="idx"
      variant="subtle"
      class="min-h-48 flex flex-col justify-between"
      data-testid="category-card"
    >
      <template #header>
        <NuxtLink :href="`/categories/${category.slug}`">
          <h3 class="text-lg font-bold">{{ category.name }}</h3>
        </NuxtLink>
      </template>
      <p>Description of category</p>
      <!-- Placeholder description -->
      <template #footer>
        <p
          v-if="category.created_at"
          class="text-sm"
        >
          Created
          {{ new Date(category.created_at || "").toLocaleDateString() }}
        </p>
      </template>
    </UCard>
  </BaseGrid>

  <div
    v-else
    class="text-center"
    data-testid="categories-list-empty"
  >
    <p>No items found</p>
  </div>
</template>
