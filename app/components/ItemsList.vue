<script lang="ts" setup>
  import type { ListProps } from "~~/types/props";

  const props = withDefaults(
    defineProps<
      ListProps<Item> & {
        filter?: {
          name?: string;
          brand?: string;
          category?: string;
        };
        sort?: {
          by: "name" | "created_at" | "brand";
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
    const filtered = useFilter(props.items, props.filter);
    return useSort(filtered, props.sort);
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
      class="min-h-32"
    />
  </Grid>

  <Grid v-else-if="outputItems.length">
    <UCard
      v-for="(item, idx) in outputItems"
      :key="idx"
      variant="subtle"
      class="min-h-32 flex flex-col justify-between"
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
  </Grid>

  <div
    v-else
    class="text-center"
  >
    <p>No items found</p>
  </div>
</template>
