<script lang="ts" setup>
  useHead({
    title: "Add Item",
  });

  definePageMeta({
    middleware: "auth",
  });

  const queryCache = useQueryCache();
  const newItemName = ref("");
  const selectedBrand = ref("");

  const brands = useBrands();

  const {
    mutate: addItem,
    asyncStatus: itemStatus,
    error: itemError,
  } = useMutation({
    mutation: (item: { name: string; brand: string }) => {
      // TODO: Add local validation
      return $fetch("/api/items", {
        method: "POST",
        body: item,
      });
    },

    async onSuccess() {
      newItemName.value = "";
      selectedBrand.value = "";
      await queryCache.invalidateQueries({ key: ["items"] });
    },

    onError(err) {
      // Use UI notify or other error handling instead of console.error
      useToast().add({
        title: "Error",
        description: err?.message || "Could not add item",
        color: "error",
      });
    },
  });

  const submitForm = () => {
    addItem({
      name: newItemName.value,
      brand: selectedBrand.value,
    });
  };
</script>

<template>
  <div class="flex flex-col gap-16">
    <PageHeader title="Add Item">
      <template #description>
        <p>Create a new item in the database.</p>
      </template>

      <template #actions>
        <UButton
          href="/items"
          color="neutral"
          variant="subtle"
          size="lg"
        >
          <UIcon
            name="i-tabler:arrow-left"
            size="1.125rem"
          />
          Back to items
        </UButton>
      </template>
    </PageHeader>
    <form
      class="flex flex-col gap-6 max-w-md"
      @submit.prevent="submitForm"
    >
      <label class="flex flex-col gap-2">
        <span class="font-medium">Item Name</span>
        <UInput
          v-model="newItemName"
          placeholder="Enter item name"
          required
        />
      </label>

      <label class="flex flex-col gap-2">
        <span class="font-medium">Brand</span>
        <USelect
          v-model="selectedBrand"
          :items="
            brands.data.value?.map((b) => ({ label: b.name, value: b.slug })) ||
            []
          "
          placeholder="Select a brand"
          required
        />
      </label>

      <UButton
        type="submit"
        color="primary"
        size="lg"
        :loading="itemStatus === 'loading'"
        :disabled="itemStatus === 'loading' || !newItemName || !selectedBrand"
      >
        Add Item
      </UButton>

      <p
        v-if="itemError"
        class="text-red-500"
      >
        {{ itemError?.message || "Failed to add item." }}
      </p>
    </form>
  </div>
</template>
