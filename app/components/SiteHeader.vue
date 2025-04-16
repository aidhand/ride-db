<script setup lang="ts">
const { loggedIn, user, clear } = useUserSession();
</script>

<template>
  <header>
    <UContainer>
      <div class="flex flex-row gap-8 items-center justify-between">
        <h1>My App</h1>
        <nav class="flex gap-4">
          <ul class="flex gap-4">
            <li><NuxtLink to="/">Home</NuxtLink></li>
            <li><NuxtLink to="/brands">Brands</NuxtLink></li>
          </ul>

          <ul
            class="flex gap-4"
            v-if="loggedIn"
          >
            <li>
              <NuxtLink to="/feed">Feed</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/profile">{{ user?.name || user?.login }}</NuxtLink>
            </li>
            <li>
              <a
                @click="clear"
                class="cursor-pointer"
                >Logout</a
              >
            </li>
          </ul>

          <ul
            class="flex gap-4"
            v-if="!loggedIn"
          >
            <li>
              <NuxtLink to="/api/auth/github">Login via GitHub</NuxtLink>
            </li>
          </ul>
        </nav>
      </div>
    </UContainer>
  </header>
</template>
