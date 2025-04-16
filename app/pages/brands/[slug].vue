<script lang="ts" setup>
const route = useRoute();
const slug = route.params.slug as string;

const { state: brand } = useQuery({
  key: ["brand", slug],
  query: ({ signal }) => useRequestFetch()(`/api/brands/${slug}`, { signal }),
});
</script>

<template>
  <div class="flex flex-col gap-16">
    <PageHeader
      :title="brand.data?.name"
      :status="brand.status"
    >
      <template #actions>
        <UButton
          to="/brands"
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
  </div>
</template>
