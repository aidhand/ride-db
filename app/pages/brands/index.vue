<script lang="ts" setup>
import type { Brand } from "~~/server/utils/db";

const { state: brands } = useBrandsList();

const filterName = ref("");

const sortBy = ref<"name" | "created_at">("name");
const sortOrder = ref(true); // true for ascending, false for descending
const sortOptions = ref([
  { label: "Name", value: "name" },
  { label: "Date", value: "created_at" },
]);
</script>

<template>
  <div class="flex flex-col gap-16">
    <PageHeader title="Brands">
      <template #description>
        <p>Welcome to the brands page!</p>
      </template>

      <template #actions>
        <UButton
          href="/brands/add"
          color="primary"
          variant="subtle"
          size="lg"
        >
          <UIcon
            name="i-tabler:layout-grid-add"
            size="1.125rem"
          />
          Create brand
        </UButton>
      </template>
    </PageHeader>

    <section class="flex flex-col lg:flex-row-reverse gap-4">
      <aside id="sidebar">
        <div>
          <UButtonGroup>
            <UBadge
              color="neutral"
              variant="subtle"
              label="Sort"
            />
            <USelect
              :items="sortOptions"
              v-model="sortBy"
              variant="outline"
            />
            <UButton
              color="neutral"
              variant="outline"
              :icon="
                sortOrder
                  ? 'i-tabler:sort-ascending-2'
                  : 'i-tabler:sort-descending-2'
              "
              @click="sortOrder = !sortOrder"
            />
          </UButtonGroup>
        </div>

        <div>
          <UButtonGroup>
            <UInput
              v-model="filterName"
              color="neutral"
              variant="outline"
              placeholder="Search"
            />

            <UButton
              color="neutral"
              variant="subtle"
              icon="i-tabler:search"
            />
          </UButtonGroup>
        </div>
      </aside>

      <!-- Updated to use sortedFilteredData instead of raw brands data -->
      <BrandsList
        :items="brands.data as Brand[] ?? []"
        :error="brands.error"
        :status="brands.status"
        :filter="{ name: filterName }"
        :sort="{ by: sortBy, order: sortOrder }"
      />
    </section>
  </div>
</template>

<style>
@reference "@/assets/css/main.css";

#sidebar {
  @apply flex gap-4;

  /* Small screens */
  @variant max-lg {
    @apply w-full flex-row justify-between items-center;
  }

  /* Large screens */
  @variant min-lg {
    @apply min-w-56;
    @apply flex-shrink flex-col;
    @apply pl-4 border-l border-neutral-500/50;
  }
}
</style>
