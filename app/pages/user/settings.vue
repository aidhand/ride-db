<script setup lang="ts">
  useHead({
    title: "Settings",
  });
  definePageMeta({
    middleware: "auth",
  });
</script>

<template>
  <PageHeader title="Settings">
    <template #description>
      <p>Manage your account settings here.</p>
    </template>
  </PageHeader>
</template>
