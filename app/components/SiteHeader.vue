<script setup lang="ts">
import type { DropdownMenuItem, NavigationMenuItem } from "@nuxt/ui";

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

const navBarItems = ref<NavigationMenuItem[]>([
  [
    {
      label: "Brands",
      icon: "i-lucide-book-open",
      to: "/brands",
      children: [
        {
          label: "Introduction",
          description: "Fully styled and customizable components for Nuxt.",
          icon: "i-lucide-house",
        },
        {
          label: "Installation",
          description:
            "Learn how to install and configure Nuxt UI in your application.",
          icon: "i-lucide-cloud-download",
        },
        {
          label: "Icons",
          icon: "i-lucide-smile",
          description:
            "You have nothing to do, @nuxt/icon will handle it automatically.",
        },
        {
          label: "Colors",
          icon: "i-lucide-swatch-book",
          description:
            "Choose a primary and a neutral color from your Tailwind CSS theme.",
        },
      ],
    },
    {
      label: "Feed",
      icon: "i-lucide-database",
      to: "/feed",
    },
    {
      label: "Deals",
      icon: "i-lucide-box",
      to: "/deals",
    },
  ],
]);

const userNavItems = ref<DropdownMenuItem[][]>([
  [
    {
      label: "Profile",
      icon: "tabler:user",
      to: "/profile",
    },
    {
      label: "Settings",
      icon: "tabler:settings",
      to: "/settings",
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
    <div class="mx-auto px-2 md:px-4 py-2 container">
      <div class="flex flex-row gap-8 items-center justify-between">
        <div><h1>My App</h1></div>

        <div>
          <UNavigationMenu
            color="neutral"
            variant="link"
            :items="navBarItems"
          />
        </div>

        <div class="flex gap-4 items-center">
          <ClientOnly v-if="!colorMode?.forced">
            <UButton
              color="neutral"
              variant="ghost"
              size="lg"
              :icon="isDark ? 'lucide-moon' : 'lucide-sun'"
              @click="isDark = !isDark"
            />
          </ClientOnly>
          <UDropdownMenu
            size="lg"
            :items="userNavItems"
            :content="{
              align: 'end',
            }"
            :ui="{
              content: 'w-40',
            }"
            v-if="loggedIn"
          >
            <UButton
              color="neutral"
              variant="outline"
              size="lg"
              trailingIcon="tabler:chevron-down"
              class="cursor-pointer"
              :label="user?.name || 'User'"
            />
          </UDropdownMenu>
          <UButton
            label="Login with GitHub"
            icon="tabler:brand-github"
            href="/api/auth/github"
            color="primary"
            variant="subtle"
            v-else
          />
        </div>
      </div>
    </div>
  </header>
</template>
