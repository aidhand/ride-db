<script lang="ts" setup>
defineProps<{
  title?: string;
  status?: "success" | "error" | "pending";
}>();

defineSlots();
</script>

<template>
  <section class="flex flex-row justify-between items-end gap-8">
    <div>
      <span class="mb-2 block text-2xl">
        <USkeleton
          v-if="status === 'pending'"
          class="h-8 w-32"
        />

        <h2
          v-else
          class="text-2xl font-semibold"
        >
          {{ title }}
        </h2>
      </span>

      <slot name="description"></slot>
    </div>

    <div>
      <slot name="actions"></slot>
    </div>
  </section>
</template>
