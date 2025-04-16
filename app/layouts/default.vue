<script setup lang="ts">
const { loggedIn, user, clear } = useUserSession();

watch(loggedIn, () => {
  if (!loggedIn.value) {
    navigateTo("/");
  }
});
</script>

<template>
  <div class="max-w-screen min-h-screen flex flex-col">
    <SiteHeader />

    <main class="flex-grow bg-neutral-500/4">
      <div class="mx-auto px-2 md:px-4 container">
        <div class="py-16 flex flex-col gap-16">
          <slot />
        </div>
      </div>
    </main>

    <footer class="">
      <div class="mx-auto px-2 md:px-4 py-16 container">
        <p>&copy; 2023 My App</p>
      </div>
    </footer>
  </div>
</template>
