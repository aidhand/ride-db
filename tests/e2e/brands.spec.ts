import { expect, test } from '@nuxt/test-utils/playwright';

test('should load the brands page', async ({ page, goto }) => {
  await goto('/brands', { waitUntil: 'hydration' });
  await expect(page).toHaveTitle(/Brands/);
});
