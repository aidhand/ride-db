<script setup lang="ts">
const { loggedIn, user, clear } = useUserSession();

watch(loggedIn, () => {
  if (!loggedIn.value) {
    navigateTo("/");
  }
});
</script>

<template>
  <div class="flex flex-col overflow-hidden">
    <SiteHeader />

    <main class="flex-grow">
      <Container>
        <div class="py-16 flex flex-col gap-16">
          <slot />
        </div>
      </Container>
    </main>

    <footer class="">
      <div class="mx-auto px-2 md:px-4 py-16 container">
        <p>&copy; 2023 My App</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";

main {
  @apply bg-white/50 dark:bg-black/50;
}
</style>
