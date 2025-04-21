import { expect, test, type Page, type Route } from "@playwright/test";

// Mock Data
const mockBrandsData = [
  { id: 1, name: "Brand Alpha", slug: "brand-alpha", created_at: new Date() },
  { id: 2, name: "Brand Beta", slug: "brand-beta", created_at: new Date() },
];

const mockItemsData = [
  {
    id: 101,
    name: "Item Zeta",
    slug: "item-zeta",
    brand: mockBrandsData[0],
    created_at: new Date("2023-01-01"),
  },
  {
    id: 102,
    name: "Item Alpha",
    slug: "item-alpha",
    brand: mockBrandsData[1],
    created_at: new Date("2023-01-03"),
  },
  {
    id: 103,
    name: "Item Gamma",
    slug: "item-gamma",
    brand: mockBrandsData[0],
    created_at: new Date("2023-01-02"),
  },
];

// Helper to mock API routes
async function mockApis(page: Page) {
  // Use Page type
  await page.route("**/api/brands**", (route: Route) => {
    // Use Route type
    route.fulfill({ json: mockBrandsData });
  });
  await page.route("**/api/items**", (route: Route) => {
    // Use Route type
    route.fulfill({ json: mockItemsData });
  });
}

test.describe("Items Page", () => {
  test("displays the correct page title", async ({ page }) => {
    await page.goto("/items");
    await expect(page.getByTestId("page-title")).toHaveText("Items");
  });

  test("displays loading state initially", async ({ page }) => {
    // Intercept items request but don't fulfill immediately
    await page.route("**/api/items**", (_route) => {
      /* Do nothing */
    });
    // Fulfill brands request so filters might render
    await page.route("**/api/brands**", (route) => {
      route.fulfill({ json: mockBrandsData });
    });
    await page.goto("/items");
    await expect(page.getByTestId("items-list-loading")).toBeVisible();
  });

  test("displays item cards when API returns data", async ({ page }) => {
    await mockApis(page);
    await page.goto("/items");

    // Wait for the grid to appear
    await expect(page.getByTestId("items-list-grid")).toBeVisible();
    await expect(page.getByTestId("items-list-loading")).not.toBeVisible();
    await expect(page.getByTestId("items-list-empty")).not.toBeVisible();
    await expect(page.getByTestId("items-list-error")).not.toBeVisible();

    // Check card count and content of the first card (default sort: name asc)
    const itemCards = page.getByTestId("item-card");
    await expect(itemCards).toHaveCount(mockItemsData.length);
    // Default sort might be by name or created_at, let's check for Item Alpha (second in mock data)
    await expect(itemCards.first().getByText("Item Alpha")).toBeVisible();
  });

  test("displays empty state when API returns empty array", async ({
    page,
  }) => {
    await page.route("**/api/brands**", (route) => {
      route.fulfill({ json: mockBrandsData });
    });
    await page.route("**/api/items**", (route) => {
      route.fulfill({ json: [] });
    });
    await page.goto("/items");

    // Wait for the empty state
    await expect(page.getByTestId("items-list-empty")).toBeVisible();
    await expect(page.getByTestId("items-list-loading")).not.toBeVisible();
    await expect(page.getByTestId("items-list-grid")).not.toBeVisible();
    await expect(page.getByTestId("items-list-error")).not.toBeVisible();
    await expect(page.getByText("No items found")).toBeVisible();
  });

  test("displays error state when API fails", async ({ page }) => {
    await page.route("**/api/brands**", (route) => {
      route.fulfill({ json: mockBrandsData });
    });
    await page.route("**/api/items**", (route) => {
      route.abort("failed");
    });
    await page.goto("/items");

    // Wait for the error state
    await expect(page.getByTestId("items-list-error")).toBeVisible();
    await expect(page.getByTestId("items-list-loading")).not.toBeVisible();
    await expect(page.getByTestId("items-list-grid")).not.toBeVisible();
    await expect(page.getByTestId("items-list-empty")).not.toBeVisible();
    await expect(page.getByText(/error/i)).toBeVisible();
  });

  test("filters items when search input is used", async ({ page }) => {
    await mockApis(page);
    await page.goto("/items");
    await expect(page.getByTestId("items-list-grid")).toBeVisible();
    await expect(page.getByTestId("item-card")).toHaveCount(
      mockItemsData.length,
    );

    // Filter by name
    const searchInput = page.getByPlaceholder("Search");
    await searchInput.fill("Gamma");
    await expect(page.getByTestId("item-card")).toHaveCount(1);
    await expect(
      page.getByTestId("item-card").getByText("Item Gamma"),
    ).toBeVisible();

    // Clear filter
    await searchInput.fill("");
    await expect(page.getByTestId("item-card")).toHaveCount(
      mockItemsData.length,
    );

    // Filter with no results
    await searchInput.fill("NonExistentItem");
    await expect(page.getByTestId("items-list-empty")).toBeVisible();
    await expect(page.getByTestId("item-card")).toHaveCount(0);
  });

  test("filters items when brand filter is used", async ({ page }) => {
    await mockApis(page);
    await page.goto("/items");
    await expect(page.getByTestId("items-list-grid")).toBeVisible();

    // Locate and open the brand select dropdown
    const brandSelect = page.locator('select[name="brand"]'); // More specific selector
    await expect(brandSelect).toBeVisible();

    // Select 'Brand Alpha'
    await brandSelect.selectOption({ label: "Brand Alpha" });

    // Check that only items with Brand Alpha are visible (Zeta, Gamma)
    await expect(page.getByTestId("item-card")).toHaveCount(2);
    await expect(
      page.getByTestId("item-card").getByText("Item Zeta"),
    ).toBeVisible();
    await expect(
      page.getByTestId("item-card").getByText("Item Gamma"),
    ).toBeVisible();
    await expect(
      page.getByTestId("item-card").getByText("Item Alpha"),
    ).not.toBeVisible();

    // Select 'All Brands'
    await brandSelect.selectOption({ label: "All Brands" });
    await expect(page.getByTestId("item-card")).toHaveCount(
      mockItemsData.length,
    );
  });

  test("changes sort order when sort button is clicked", async ({ page }) => {
    await mockApis(page);
    await page.goto("/items");
    await expect(page.getByTestId("items-list-grid")).toBeVisible();

    const sortButton = page.getByRole("button", { name: /Sort by/i }); // Assuming button has accessible name
    const itemCards = page.getByTestId("item-card");

    // Initial state (assuming default is name ascending: Alpha, Gamma, Zeta)
    await expect(itemCards.nth(0)).toContainText("Item Alpha");
    await expect(itemCards.nth(1)).toContainText("Item Gamma");
    await expect(itemCards.nth(2)).toContainText("Item Zeta");

    // Click to sort descending
    await sortButton.click();
    await expect(itemCards.nth(0)).toContainText("Item Zeta");
    await expect(itemCards.nth(1)).toContainText("Item Gamma");
    await expect(itemCards.nth(2)).toContainText("Item Alpha");

    // Click again to sort ascending
    await sortButton.click();
    await expect(itemCards.nth(0)).toContainText("Item Alpha");
    await expect(itemCards.nth(1)).toContainText("Item Gamma");
    await expect(itemCards.nth(2)).toContainText("Item Zeta");
  });

  test('navigates to the "Add Item" page when "Add Item" button is clicked', async ({
    page,
  }) => {
    await page.goto("/items");
    // No API mocking needed for simple navigation test
    const addButton = page.getByRole("link", { name: /Add Item/i });
    await expect(addButton).toBeVisible();

    await addButton.click();
    await page.waitForURL("**/items/add");

    expect(page.url()).toContain("/items/add");
    await expect(page.getByTestId("page-title")).toHaveText("Add Item");
  });

  test("navigates to item details page when clicking on an item", async ({
    page,
  }) => {
    await mockApis(page);
    await page.goto("/items");
    await expect(page.getByTestId("items-list-grid")).toBeVisible();

    // Find the first item card (Item Alpha in default sort)
    const firstItemCard = page
      .getByTestId("item-card")
      .filter({ hasText: "Item Alpha" });
    await expect(firstItemCard).toBeVisible();

    const targetItem = mockItemsData.find(
      (item) => item.name === "Item Alpha",
    )!;

    // Mock the specific item detail API call *before* clicking
    await page.route(`**/api/items/${targetItem.slug}`, (route) => {
      route.fulfill({ json: targetItem });
    });

    // Click the link within the card
    await firstItemCard.locator("a").click();

    // Wait for navigation
    await page.waitForURL(`**/items/${targetItem.slug}`);

    expect(page.url()).toContain(`/items/${targetItem.slug}`);
    // Check for an element specific to the detail page
    await expect(page.getByTestId("page-title")).toHaveText(targetItem.name);
  });
});
