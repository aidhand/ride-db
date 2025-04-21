<script lang="ts" setup>
  useHead({
    title: "Items",
  });

  const items = useItems();
  const brands = useBrands();
  const categories = useCategories();

  const activeFilters = ref<{
    name: string;
    brands: Array<{ label: string; value: string }>;
    categories: Array<{ label: string; value: string }>;
  }>({
    name: "",
    brands: [],
    categories: [],
  });

  const filterBrands = ref([
    ...(brands.data.value?.map((b) => ({
      label: b.name,
      value: b.slug,
    })) || []),
  ]);
  const filterCategories = ref([
    ...(categories.data.value?.map((c) => ({
      label: c.name,
      value: c.slug,
    })) || []),
  ]);

  const sortBy = ref<"name" | "brand" | "category" | "created_at">("name");
  const sortOrder = ref(true); // true for ascending, false for descending
  const sortOptions = ref([
    { label: "Name", value: "name" },
    { label: "Brand", value: "brand" },
    { label: "Category", value: "category" },
    { label: "Date", value: "created_at" },
  ]);
</script>

<template>
  <div class="flex flex-col gap-16">
    <PageHeader title="Items">
      <template #description>
        <p>Browse all items in the catalog</p>
      </template>

      <template #actions>
        <div class="flex flex-wrap gap-4 items-end">
          <UButtonGroup>
            <UInput
              v-model="activeFilters.name"
              color="neutral"
              variant="outline"
              size="lg"
              placeholder="Search"
            />

            <UButton
              color="neutral"
              variant="subtle"
              size="lg"
              icon="i-tabler:search"
              class="cursor-pointer"
            />
          </UButtonGroup>

          <UButtonGroup>
            <UBadge
              color="neutral"
              variant="subtle"
              size="lg"
              label="Brand"
            />
            <USelectMenu
              v-model="activeFilters.brands"
              :items="filterBrands"
              multiple
              placeholder="All brands"
              variant="outline"
              size="lg"
              class="w-48"
              clearable
            />
          </UButtonGroup>

          <UButtonGroup>
            <UBadge
              color="neutral"
              variant="subtle"
              size="lg"
              label="Category"
            />
            <USelectMenu
              v-model="activeFilters.categories"
              :items="filterCategories"
              multiple
              placeholder="All categories"
              variant="outline"
              size="lg"
              class="w-48"
            />
          </UButtonGroup>

          <UButtonGroup>
            <UBadge
              color="neutral"
              variant="subtle"
              size="lg"
              label="Sort"
            />
            <USelect
              v-model="sortBy"
              :items="sortOptions"
              variant="outline"
              size="lg"
              class="w-32"
            />
            <UButton
              color="neutral"
              variant="outline"
              size="lg"
              :icon="
                sortOrder
                  ? 'i-tabler:sort-ascending-2'
                  : 'i-tabler:sort-descending-2'
              "
              class="cursor-pointer"
              @click="sortOrder = !sortOrder"
            />
          </UButtonGroup>
        </div>
      </template>
    </PageHeader>

    <section class="flex flex-col gap-4">
      <ItemsList
        :items="(items.data.value as Item[]) || undefined"
        :status="items.status.value"
        :error="items.error.value"
        :filter="{
          name: activeFilters.name,
          brands: activeFilters.brands.map((b) => b.value),
          categories: activeFilters.categories.map((c) => c.value),
        }"
        :sort="{ by: sortBy, order: sortOrder }"
      />
    </section>
  </div>
</template>
