<script lang="ts" setup>
  useHead({
    title: "Brands",
  });

  const filterName = ref("");
  const sortBy = ref<"name" | "created_at">("name");
  const sortOrder = ref(true); // true for ascending, false for descending
  const sortOptions = ref([
    { label: "Name", value: "name" },
    { label: "Date", value: "created_at" },
  ]);

  const brands = useBrands();

  // Set the page title
</script>

<template>
  <div class="flex flex-col gap-16">
    <PageHeader title="Brands">
      <template #description>
        <p>Welcome to the brands page!</p>
      </template>

      <template #actions>
        <div class="flex flex-wrap gap-4 items-end">
          <UButtonGroup>
            <UInput
              v-model="filterName"
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
          <div>
            <UButton
              href="/brands/add"
              color="primary"
              variant="subtle"
              size="lg"
            >
              <UIcon
                name="tabler:layout-grid-add"
                size="1.125rem"
              />
              Create brand
            </UButton>
          </div>
        </div>
      </template>
    </PageHeader>

    <section class="flex flex-col gap-4">
      <BrandsList
        :items="(brands.data.value as Brand[]) || undefined"
        :error="brands.error.value"
        :status="brands.status.value"
        :filter="{ name: filterName }"
        :sort="{ by: sortBy, order: sortOrder }"
      />
    </section>
  </div>
</template>
