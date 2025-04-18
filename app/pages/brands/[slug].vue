<script lang="ts" setup>
const route = useRoute();
const slug = route.params.slug as string;

const brand = useBrand(slug);
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
  </div>
</template>
