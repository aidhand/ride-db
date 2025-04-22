<script lang="ts" setup>
  const route = useRoute();
  const slug = route.params.slug as string;

  const category = useCategory(slug); // Use the category composable
  const items = useItemsByCategory(slug, {
    limit: 6,
  });

  useHead({
    title: category.data.value?.name || "Category", // Update title
  });
</script>

<template>
  <div class="flex flex-col gap-16">
    <PageHeader
      :title="category.data.value?.name"
      :status="category.status.value"
    >
      <template #actions>
        <UButton
          href="/categories"
          color="neutral"
          variant="subtle"
          size="lg"
        >
          <UIcon
            name="i-tabler:arrow-left"
            size="1.125rem"
          />
          Back to categories
        </UButton>
      </template>
    </PageHeader>
    <!-- TODO: Add content specific to the category page, e.g., list items in this category -->
    <ItemsList
      :items="(items.data.value as Item[]) || undefined"
      :status="items.status.value"
      :error="items.error.value"
    />
  </div>
</template>
