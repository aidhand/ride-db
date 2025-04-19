import { expect, test } from "@nuxt/test-utils/playwright";
// Define regex patterns at the top level
const BRANDS_TITLE_REGEX = /Brands/;

test("should load the brands page", async ({ page, goto }) => {
  await goto("/brands", { waitUntil: "hydration" });
  await expect(page).toHaveTitle(BRANDS_TITLE_REGEX);
});
