<script lang="ts" setup>
  const route = useRoute();
  const slug = route.params.slug as string;

  const brand = useBrand(slug);
  const items = useItemsByBrand(slug, {
    limit: 1,
  });

  useHead({
    title: brand.data.value?.name || "Brand",
  });
</script>

<template>
  <div class="flex flex-col gap-16">
    <!-- TODO: Make the heading bigger -->
    <!-- TODO: Use the brand logo where possible -->
    <!-- TODO: Add a description or backstory of the brand -->
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
      :items="(items.data.value as Item[]) || undefined"
      :status="items.status.value"
      :error="items.error.value"
    />
  </div>
</template>
