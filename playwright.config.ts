import type { ConfigOptions } from "@nuxt/test-utils/playwright";
import { defineConfig, devices } from "@playwright/test";
import { fileURLToPath } from "node:url";
import { isCI, isWindows } from "std-env";

export default defineConfig<ConfigOptions>({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  timeout: isWindows ? 1000 * 60 * 5 : undefined,
  reporter: "html",

  use: {
    trace: "on-first-retry",
    screenshot: "on",

    nuxt: {
      rootDir: fileURLToPath(new URL(".", import.meta.url)),
      buildDir: fileURLToPath(new URL("./.nuxt", import.meta.url)),
      configFile: fileURLToPath(new URL("./nuxt.config.ts", import.meta.url)),
      dev: true,
    },
  },

  projects: [
    {
      name: "Chromium (Headless)",
      use: { ...devices["Desktop Chrome"], channel: "chromium" },
    },
  ],
});
