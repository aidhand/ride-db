<script lang="ts" setup>
definePageMeta({
  middleware: "auth",
});
</script>
<template>
  <div class="flex flex-col gap-16">
    <PageHeader title="Add Brand">
      <template #description>
        <p>Create a new brand in the database.</p>
      </template>

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
