<script setup lang="ts">
const { loggedIn, user, clear } = useUserSession();

watch(loggedIn, () => {
  if (!loggedIn.value) {
    navigateTo("/");
  }
});
</script>

<template>
  <div class="min-h-screen flex flex-col gap-8">
    <SiteHeader />

    <main class="flex-grow">
      <UContainer>
        <div class="flex flex-col gap-16">
          <slot />
        </div>
      </UContainer>
    </main>

    <footer class="px-2 md:px-4">
      <UContainer>
        <p>&copy; 2023 My App</p>
      </UContainer>
    </footer>
  </div>
</template>
