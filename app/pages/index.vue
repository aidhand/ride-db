<script lang="ts" setup>
  const { site } = useAppConfig();

  useHead({
    title: site.description,
  });
</script>

<template>
  <div>
    <PageHeader :title="site.name">
      <template #description>
        <p>{{ site.description }}</p>
      </template>
    </PageHeader>
  </div>
</template>
