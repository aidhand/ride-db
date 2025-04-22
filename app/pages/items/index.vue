<script lang="ts" setup>
  import type { SortableColumns } from "~~/types/props";

  useHead({
    title: "Items",
  });

  const route = useRoute();
  const router = useRouter();

  const items = useItems();
  const brands = useBrands();
  const categories = useCategories();

  const searchQuery = route.query.s as string;

  const brandsQuery = [route.query.b, route.query.brand, route.query.brands]
    .filter(Boolean)
    .join(",");
  const brandsArray = brandsQuery ? brandsQuery.split(",") : [];

  const categoriesQuery = [
    route.query.c,
    route.query.category,
    route.query.categories,
  ]
    .filter(Boolean)
    .join(",");
  const categoriesArray = categoriesQuery ? categoriesQuery.split(",") : [];

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

  const sortOptions = [
    { label: "Name", value: "name" },
    { label: "Brand", value: "brand" },
    { label: "Category", value: "category" },
    { label: "Date", value: "created_at" },
  ];

  // Make a list of active brands by checking the brands query array against the list of brands we can filter by
  const activeBrands = brandsArray
    .map((b) => filterBrands.value?.find((br) => br.value === b))
    .filter((b): b is { label: string; value: string } => b !== undefined);

  // Make a list of active categories by checking the categories query array against the list of categories we can filter by
  const activeCategories = categoriesArray
    .map((c) => filterCategories.value?.find((cat) => cat.value === c))
    .filter((c): c is { label: string; value: string } => c !== undefined);

  const activeFilters = ref<{
    name: string;
    brands: Array<{ label: string; value: string }>;
    categories: Array<{ label: string; value: string }>;
    sortBy: keyof SortableColumns;
    sortOrder: boolean;
  }>({
    name: searchQuery || "",
    brands: activeBrands,
    categories: activeCategories,
    sortBy: "name" as keyof SortableColumns,
    sortOrder: true,
  });

  // Watch for changes in the filters and update the query parameters accordingly
  watch(
    activeFilters.value,
    (filters) => {
      router.push({
        query: {
          s: filters.name || undefined,
          b: filters.brands.map((b) => b.value).join(",") || undefined,
          c: filters.categories.map((c) => c.value).join(",") || undefined,
        },
      });
    },
    { deep: true },
  );
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
              clearable
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
              v-model="activeFilters.sortBy"
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
                activeFilters.sortOrder
                  ? 'i-tabler:sort-ascending-2'
                  : 'i-tabler:sort-descending-2'
              "
              class="cursor-pointer"
              @click="activeFilters.sortOrder = !activeFilters.sortOrder"
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
        :sort="{
          by: activeFilters.sortBy as keyof SortableColumns,
          order: activeFilters.sortOrder,
        }"
      />
    </section>
  </div>
</template>
