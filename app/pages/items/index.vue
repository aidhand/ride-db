<script lang="ts" setup>
const filterName = ref('');
const filterBrand = ref('');
const sortBy = ref<'name' | 'brand' | 'created_at'>('name');
const sortOrder = ref(true); // true for ascending, false for descending
const sortOptions = ref([
  { label: 'Name', value: 'name' },
  { label: 'Brand', value: 'brand' },
  { label: 'Date', value: 'created_at' },
]);

const items = useItems();
const brands = useBrands();
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
              label="Brand"
            />
            <USelect
              v-model="filterBrand"
              :items="
                brands.data.value?.map((b) => ({
                  label: b.name,
                  value: b.slug,
                })) || []
              "
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
              label="Sort"
            />
            <USelect
              :items="sortOptions"
              v-model="sortBy"
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
              @click="sortOrder = !sortOrder"
              class="cursor-pointer"
            />
          </UButtonGroup>
          <div>
            <UButton
              href="/items/add"
              color="primary"
              variant="subtle"
              size="lg"
            >
              <UIcon
                name="tabler:shopping-cart-plus"
                size="1.125rem"
              />
              Add Item
            </UButton>
          </div>
        </div>
      </template>
    </PageHeader>

    <section class="flex flex-col gap-4">
      <ItemsList
        :items="items.data.value as Item[] || undefined"
        :error="items.error.value"
        :status="items.status.value"
        :filter="{ name: filterName, brand: filterBrand }"
        :sort="{ by: sortBy, order: sortOrder }"
      />
    </section>
  </div>
</template>
