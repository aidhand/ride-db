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
  >
    <p>Error: {{ error }}</p>
  </div>

  <Grid v-else-if="status === 'pending'">
    <USkeleton
      v-for="(_, idx) in Array.from({ length: 5 })"
      :key="idx"
      class="min-h-48"
    />
  </Grid>

  <Grid v-else-if="outputItems.length">
    <UCard
      v-for="(brand, idx) in outputItems"
      :key="idx"
      variant="subtle"
      class="min-h-48 flex flex-col justify-between"
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
  </Grid>

  <div
    v-else
    class="text-center"
  >
    <p>No items found</p>
  </div>
</template>
