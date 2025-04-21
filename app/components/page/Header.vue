<script lang="ts" setup>
  defineProps<{
    title?: Ref<string> | string;
    status?: "success" | "error" | "pending";
  }>();

  defineSlots();
</script>

<template>
  <section class="flex flex-row flex-wrap justify-between items-end gap-8">
    <div>
      <div class="mb-2 min-h-8">
        <USkeleton
          v-if="status === 'pending'"
          class="h-8 w-32"
        />

        <h2
          v-else
          class="text-2xl font-semibold"
          data-testid="page-title"
        >
          {{ title }}
        </h2>
      </div>

      <slot name="description" />
    </div>

    <div>
      <slot name="actions" />
    </div>
  </section>
</template>
