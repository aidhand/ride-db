<script lang="ts" setup>
import type { Brand } from "~~/server/utils/db";

const props = defineProps<{ item: Brand }>();
</script>

<template>
  <UCard
    variant="subtle"
    class="flex flex-col justify-between"
  >
    <template #header>
      <NuxtLink :href="`/brands/${props.item.slug}`">
        <h3 class="text-lg font-bold">{{ props.item.name }}</h3>
      </NuxtLink>
    </template>

    <p>Description and logo of brand</p>
    <template #footer>
      <p
        v-if="props.item.created_at"
        class="text-sm"
      >
        Created
        {{ new Date(props.item.created_at || "").toLocaleDateString() }}
      </p>
    </template>
  </UCard>
</template>
