<script setup lang="ts">
  import type { DropdownMenuItem } from "@nuxt/ui";

  const colorMode = useColorMode();
  const { loggedIn, user, clear } = useUserSession();

  const isDark = computed({
    get() {
      return colorMode.value === "dark";
    },
    set() {
      colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
    },
  });

  const userNavItems = ref<DropdownMenuItem[][]>([
    [
      {
        label: "Profile",
        icon: "tabler:user",
        href: "/user/profile",
      },
      {
        label: "Watchlist",
        icon: "tabler:list-check",
        href: "/user/watchlist",
      },
      {
        label: "Settings",
        icon: "tabler:settings",
        href: "/user/settings",
      },
    ],
    [
      {
        label: "Logout",
        icon: "tabler:logout",
        onSelect: () => {
          clear();
          navigateTo("/");
        },
      },
    ],
  ]);
</script>

<template>
  <header>
    <BaseContainer>
      <div class="min-h-16 flex flex-row gap-8 items-center justify-between">
        <div>
          <NuxtLink href="/">
            <h1>My App</h1>
          </NuxtLink>
        </div>

        <div class="flex-grow">
          <SiteNavigation />
        </div>

        <div class="flex gap-4 items-center">
          <div>
            <UButton
              color="neutral"
              variant="ghost"
              size="lg"
              :icon="isDark ? 'lucide-moon' : 'lucide-sun'"
              @click="isDark = !isDark"
            />
          </div>
          <div>
            <UDropdownMenu
              v-if="loggedIn"
              size="lg"
              :items="userNavItems"
              :content="{
                align: 'end',
              }"
              :ui="{
                content: 'w-40',
              }"
            >
              <UButton
                color="neutral"
                variant="outline"
                size="lg"
                trailing-icon="tabler:chevron-down"
                class="cursor-pointer"
                :label="user?.name"
              />
            </UDropdownMenu>
            <UButton
              v-else
              label="Login with GitHub"
              href="/api/auth/github"
              icon="tabler:brand-github"
              color="primary"
              variant="subtle"
            />
          </div>
        </div>
      </div>
    </BaseContainer>
  </header>
</template>
