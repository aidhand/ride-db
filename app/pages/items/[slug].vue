<script lang="ts" setup>
const route = useRoute();
const slug = route.params.slug as string;

const item = useItem(slug);

// Helper function for safe date formatting
const formatDate = (dateString: string | null) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString();
};
</script>

<template>
  <div class="flex flex-col gap-16">
    <PageHeader
      :title="item.data.value?.name"
      :status="item.status.value"
    >
      <template
        #description
        v-if="item.data.value"
      >
        <p class="text-lg text-gray-500">
          Brand:
          <NuxtLink
            :to="`/brands/${item.data.value.brand}`"
            class="text-primary-600 hover:underline"
          >
            {{ item.data.value.brand }}
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
      v-if="item.status.value === 'pending'"
      class="flex justify-center"
    >
      <!-- TODO: Change to skeleton -->
      <ULoadingBar size="lg" />
    </div>

    <div
      v-else-if="item.error.value"
      class="bg-red-50 p-4 rounded-lg"
    >
      <p class="text-red-600">
        {{ item.error.value.message || "Failed to load item" }}
      </p>
    </div>

    <div
      v-else-if="item.data.value"
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
            <dd class="font-mono text-sm">{{ item.data.value.id }}</dd>
            <dt class="font-medium text-gray-600">Brand:</dt>
            <dd>
              <NuxtLink
                :to="`/brands/${item.data.value.brand}`"
                class="text-primary-600 hover:underline"
              >
                {{ item.data.value.brand }}
              </NuxtLink>
            </dd>
            <dt class="font-medium text-gray-600">Category:</dt>
            <dd>
              <NuxtLink
                :to="`/categories/${item.data.value.category}`"
                class="text-primary-600 hover:underline"
              >
                {{ item.data.value.category }}
              </NuxtLink>
            </dd>

            <dt class="font-medium text-gray-600">Added:</dt>
            <dd>
              {{ formatDate(item.data.value.created_at) }}
            </dd>
            <dt class="font-medium text-gray-600">Updated:</dt>
            <dd>
              {{ formatDate(item.data.value.updated_at) }}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>
