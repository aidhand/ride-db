<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
});

const { loggedIn, user, session, fetch, clear, openInPopup } = useUserSession();
</script>

<template>
  <PageHeader title="Profile">
    <template #description>
      <p>View and edit your profile information here.</p>
    </template>
  </PageHeader>

  <div>
    <h3>Session Information</h3>
    <pre>{{ session }}</pre>
  </div>
</template>
