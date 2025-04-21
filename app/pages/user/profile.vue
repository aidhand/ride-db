<script setup lang="ts">
  useHead({
    title: "Profile",
  });
  definePageMeta({
    middleware: "auth",
  });

  const { session } = useUserSession();
</script>

<template>
  <div>
    <PageHeader title="Profile">
      <template #description>
        <p>View and edit your profile information here.</p>
      </template>
    </PageHeader>

    <div>
      <h3>Session Information</h3>
      <pre>{{ session }}</pre>
    </div>
  </div>
</template>
