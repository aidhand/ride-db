<script lang="ts" setup>
definePageMeta({
  middleware: 'auth',
});

const queryCache = useQueryCache();
const newBrand = ref('');

const {
  mutate: addBrand,
  asyncStatus: brandStatus,
  error: brandError,
} = useMutation({
  mutation: (name: string) => {
    // TODO: Add local validation
    return $fetch('/api/brands', {
      method: 'POST',
      body: {
        name,
      },
    });
  },

  async onSuccess(brand) {
    newBrand.value = '';
    await queryCache.invalidateQueries({ key: ['brands'] });
  },

  onError(err) {
    console.error(err);
  },
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
    <form
      class="flex flex-col gap-6 max-w-md"
      @submit.prevent="addBrand(newBrand)"
    >
      <label class="flex flex-col gap-2">
        <span class="font-medium">Brand Name</span>
        <UInput
          v-model="newBrand"
          placeholder="Enter brand name"
          required
        />
      </label>
      <UButton
        type="submit"
        color="primary"
        size="lg"
        :loading="brandStatus === 'loading'"
        :disabled="brandStatus === 'loading'"
      >
        Add Brand
      </UButton>
      <p
        v-if="brandError"
        class="text-red-500"
      >
        {{ brandError?.message || "Failed to add brand." }}
      </p>
    </form>
  </div>
</template>
