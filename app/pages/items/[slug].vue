<script lang="ts" setup>
  const route = useRoute();
  const slug = route.params.slug as string;

  // Prefix unused variables with _
  const { data: item, error: _error, status } = useItem(slug); // Use the items composable

  useHead({
    title: () => item.value?.name || "Item", // Use computed title
  });

  // Helper function for safe date formatting - prefix with _ as it's used only in template now
  const _formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };
</script>

<template>
  <div class="flex flex-col gap-16">
    <PageHeader
      :title="item?.name"
      :status="status"
    >
      <template
        v-if="item"
        #description
      >
        <p class="text-lg text-gray-500">
          Brand:
          <NuxtLink
            :to="`/brands/${item.brand}`"
            class="text-primary-600 hover:underline"
          >
            {{ item.brand }}
          </NuxtLink>
        </p>
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

    <div
      v-if="status === 'pending'"
      class="flex justify-center"
    >
      <!-- TODO: Change to skeleton -->
      <ULoadingBar size="lg" />
    </div>

    <div
      v-else-if="_error"
      class="bg-red-50 p-4 rounded-lg"
    >
      <p class="text-red-600">
        {{ _error?.message || "Failed to load item" }}
      </p>
    </div>

    <div
      v-else-if="item"
      class="grid grid-cols-1 md:grid-cols-2 gap-8"
    >
      <div class="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
        <!-- Placeholder for item image -->
        <UIcon
          name="i-tabler:shopping-bag"
          class="w-32 h-32 text-gray-400"
        />
      </div>

      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <h3 class="text-lg font-medium">Details</h3>
          <dl class="grid grid-cols-[120px_1fr] gap-2">
            <dt class="font-medium text-gray-600">Item ID:</dt>
            <dd class="font-mono text-sm">{{ item.id }}</dd>
            <dt class="font-medium text-gray-600">Brand:</dt>
            <dd>
              <NuxtLink
                :to="`/brands/${item.brand}`"
                class="text-primary-600 hover:underline"
              >
                {{ item.brand }}
              </NuxtLink>
            </dd>
            <dt class="font-medium text-gray-600">Category:</dt>
            <dd>
              <NuxtLink
                :to="`/categories/${item.category}`"
                class="text-primary-600 hover:underline"
              >
                {{ item.category }}
              </NuxtLink>
            </dd>

            <dt class="font-medium text-gray-600">Added:</dt>
            <dd>
              {{ _formatDate(item.created_at) }}
            </dd>
            <dt class="font-medium text-gray-600">Updated:</dt>
            <dd>
              {{ _formatDate(item.updated_at) }}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>
