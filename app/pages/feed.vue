<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
});
</script>

<template>
  <PageHeader title="Feed">
    <template #description>
      <p>The latest news, updates, and articles from the motorcycle world.</p>
    </template>
  </PageHeader>
</template>
