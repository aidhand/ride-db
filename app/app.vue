<script lang="ts" setup>
  const appConfig = useAppConfig();

  useHead({
    titleTemplate: (title) => {
      return title ? `${title} | ${appConfig.site.name}` : appConfig.site.name;
    },
    meta: [
      { name: "description", content: "A database for riders" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
    ],
  });
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
