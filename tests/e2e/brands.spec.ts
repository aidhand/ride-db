import { expect, test } from "@playwright/test";

// Mock Data
const mockBrands = [
  { id: 1, name: "Brand Alpha", slug: "brand-alpha", created_at: new Date() },
  { id: 2, name: "Brand Beta", slug: "brand-beta", created_at: new Date() },
  {
    id: 3,
    name: "Test Brand Gamma",
    slug: "test-brand-gamma",
    created_at: new Date(),
  },
];

test.describe("Brands Page", () => {
  test("displays the correct page title", async ({ page }) => {
    await page.goto("/brands");
    await expect(page.getByTestId("page-title")).toHaveText("Brands");
  });

  test("displays loading state initially", async ({ page }) => {
    // Intercept the request but don't fulfill it immediately
    await page.route("**/api/brands**", (_route) => {
      // Prefix unused route param
      // Don't call route.fulfill() or route.continue() yet
    });
    await page.goto("/brands");
    await expect(page.getByTestId("brands-list-loading")).toBeVisible();
  });

  test("displays brand cards when API returns data", async ({ page }) => {
    // Mock the API response
    await page.route("**/api/brands**", (route) => {
      route.fulfill({ json: mockBrands });
    });

    await page.goto("/brands");

    // Wait for the grid to appear (loading should disappear)
    await expect(page.getByTestId("brands-list-grid")).toBeVisible();
    await expect(page.getByTestId("brands-list-loading")).not.toBeVisible();
    await expect(page.getByTestId("brands-list-empty")).not.toBeVisible();
    await expect(page.getByTestId("brands-list-error")).not.toBeVisible();

    // Check card count and content of the first card
    const brandCards = page.getByTestId("brand-card");
    await expect(brandCards).toHaveCount(mockBrands.length);
    await expect(brandCards.first().getByText("Brand Alpha")).toBeVisible();
  });

  test("displays empty state when API returns empty array", async ({
    page,
  }) => {
    // Mock the API response
    await page.route("**/api/brands**", (route) => {
      route.fulfill({ json: [] });
    });

    await page.goto("/brands");

    // Wait for the empty state to appear
    await expect(page.getByTestId("brands-list-empty")).toBeVisible();
    await expect(page.getByTestId("brands-list-loading")).not.toBeVisible();
    await expect(page.getByTestId("brands-list-grid")).not.toBeVisible();
    await expect(page.getByTestId("brands-list-error")).not.toBeVisible();
    await expect(page.getByText("No items found")).toBeVisible();
  });

  test("displays error state when API fails", async ({ page }) => {
    // Mock the API response to simulate an error
    await page.route("**/api/brands**", (route) => {
      route.abort("failed"); // or route.fulfill({ status: 500 });
    });

    await page.goto("/brands");

    // Wait for the error state to appear
    await expect(page.getByTestId("brands-list-error")).toBeVisible();
    await expect(page.getByTestId("brands-list-loading")).not.toBeVisible();
    await expect(page.getByTestId("brands-list-grid")).not.toBeVisible();
    await expect(page.getByTestId("brands-list-empty")).not.toBeVisible();
    // Check for a generic error message (adjust if specific message is shown)
    await expect(page.getByText(/error/i)).toBeVisible();
  });

  test("filters brands when search input is used", async ({ page }) => {
    // Mock the API response
    await page.route("**/api/brands**", (route) => {
      route.fulfill({ json: mockBrands });
    });
    await page.goto("/brands");

    // Wait for initial list
    await expect(page.getByTestId("brands-list-grid")).toBeVisible();
    await expect(page.getByTestId("brand-card")).toHaveCount(mockBrands.length);

    // Type a filter query
    const searchInput = page.getByPlaceholder("Search");
    await searchInput.fill("Alpha");

    // Check that only matching cards are visible
    await expect(page.getByTestId("brand-card")).toHaveCount(1);
    await expect(
      page.getByTestId("brand-card").getByText("Brand Alpha"),
    ).toBeVisible();
    await expect(
      page.getByTestId("brand-card").getByText("Brand Beta"),
    ).not.toBeVisible();

    // Clear filter
    await searchInput.fill("");
    await expect(page.getByTestId("brand-card")).toHaveCount(mockBrands.length);

    // Filter with no results
    await searchInput.fill("NonExistentBrand");
    await expect(page.getByTestId("brands-list-empty")).toBeVisible();
    await expect(page.getByTestId("brand-card")).toHaveCount(0);
  });

  test('navigates to the "Add Brand" page when "Create brand" is clicked', async ({
    page,
  }) => {
    await page.goto("/brands");
    // No need to mock API here as we are just testing navigation away
    const createButton = page.getByRole("link", { name: /Create brand/i });
    await expect(createButton).toBeVisible();

    await createButton.click();
    await page.waitForURL("**/brands/add"); // Wait for navigation to complete

    expect(page.url()).toContain("/brands/add");
    await expect(page.getByTestId("page-title")).toHaveText("Add Brand");
  });

  test("navigates to the brand detail page when a brand card is clicked", async ({
    page,
  }) => {
    // Mock the API response
    await page.route("**/api/brands**", (route) => {
      route.fulfill({ json: mockBrands });
    });
    await page.goto("/brands");

    // Wait for cards and click the first one
    await expect(page.getByTestId("brands-list-grid")).toBeVisible();
    const firstCard = page.getByTestId("brand-card").first();
    await expect(firstCard.getByText("Brand Alpha")).toBeVisible();

    // Add non-null assertions for mockBrands[0]
    const firstBrand = mockBrands[0]!;

    // Mock the specific brand detail API call *before* clicking
    await page.route(`**/api/brands/${firstBrand.slug}`, (route) => {
      route.fulfill({ json: firstBrand });
    });

    await firstCard.click();
    await page.waitForURL(`**/brands/${firstBrand.slug}`); // Wait for navigation

    expect(page.url()).toContain(`/brands/${firstBrand.slug}`);
    // Check for an element specific to the detail page (e.g., the brand name as title)
    await expect(page.getByTestId("page-title")).toHaveText(firstBrand.name);
  });
});
