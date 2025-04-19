<script lang="ts" setup>
import { useItemsByBrand } from "~/composables/useItemsByBrand";

const route = useRoute();
const slug = route.params.slug as string;

const brand = useBrand(slug);
const itemsQuery = useItemsByBrand(slug);
</script>

<template>
  <div class="flex flex-col gap-16">
    <PageHeader
      :title="brand.data.value?.name"
      :status="brand.status.value"
    >
      <template #actions>
        <UButton
          href="/brands"
          color="neutral"
          variant="subtle"
          size="lg"
        >
          <UIcon
            name="i-tabler:arrow-left"
            size="1.125rem"
          />
          Back to brands
        </UButton>
      </template>
    </PageHeader>

    <ItemsList
      :items="itemsQuery.data.value as Item[] || []"
      :error="itemsQuery.error.value"
      :status="itemsQuery.status.value"
    />
  </div>
</template>
