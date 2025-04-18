<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});
</script>

<template>
  <PageHeader title="Watchlist">
    <template #description>
      <p>Your saved items will appear here.</p>
    </template>
  </PageHeader>
</template>
