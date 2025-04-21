<script lang="ts" setup>
  import type { ListProps } from "~~/types/props";

  const props = withDefaults(
    defineProps<
      ListProps<Brand> & {
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
    data-testid="brands-list-error"
  >
    <p>Error: {{ error }}</p>
  </div>

  <BaseGrid
    v-else-if="status === 'pending'"
    data-testid="brands-list-loading"
  >
    <USkeleton
      v-for="(_, idx) in Array.from({ length: 5 })"
      :key="idx"
      class="min-h-48"
    />
  </BaseGrid>

  <BaseGrid
    v-else-if="outputItems.length"
    data-testid="brands-list-grid"
  >
    <UCard
      v-for="(brand, idx) in outputItems"
      :key="idx"
      variant="subtle"
      class="min-h-48 flex flex-col justify-between"
      data-testid="brand-card"
    >
      <template #header>
        <NuxtLink :href="`/brands/${brand.slug}`">
          <h3 class="text-lg font-bold">{{ brand.name }}</h3>
        </NuxtLink>
      </template>
      <p>Description and logo of brand</p>
      <template #footer>
        <p
          v-if="brand.created_at"
          class="text-sm"
        >
          Created
          {{ new Date(brand.created_at || "").toLocaleDateString() }}
        </p>
      </template>
    </UCard>
  </BaseGrid>

  <div
    v-else
    class="text-center"
    data-testid="brands-list-empty"
  >
    <p>No items found</p>
  </div>
</template>
