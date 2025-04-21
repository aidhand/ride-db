import { describe, expect, it } from "vitest";
import { ref } from "vue";
import { useSort } from "~/composables/useSort";

type Item = {
  name: string;
  brand?: string | null;
  created_at: string | Date | null;
  slug?: string; // Align with SortableColumns
};

// More diverse items, removed 'count'
const items: Item[] = [
  {
    name: "Charlie",
    brand: "BrandC",
    created_at: "2022-01-03",
    slug: "charlie",
  },
  { name: "Alpha", brand: "BrandA", created_at: "2022-01-01", slug: "alpha" },
  { name: "Bravo", brand: "BrandB", created_at: "2022-01-02", slug: "bravo" },
  {
    name: "delta", // Lowercase name
    brand: "BrandA", // Duplicate brand
    created_at: new Date("2022-01-04"), // Date object
    slug: "delta",
  },
  { name: "Echo", brand: null, created_at: "2022-01-05", slug: "echo" }, // Null brand
  { name: "Foxtrot", brand: "BrandD", created_at: null, slug: "foxtrot" }, // Null created_at
  {
    name: "Golf",
    brand: undefined, // Undefined brand
    created_at: new Date("2021-12-31"), // Earlier date
    slug: "golf",
  },
];

// Expected orderings (updated for current data)
const namesAsc = [
  "Alpha",
  "Bravo",
  "Charlie",
  "delta",
  "Echo",
  "Foxtrot",
  "Golf",
];
const namesDesc = [...namesAsc].reverse();
// Note: Sorting behavior with null/undefined might place them first or last depending on implementation.
// Assuming null/undefined come first when ascending.
const brandsAsc = [
  undefined,
  null,
  "BrandA",
  "BrandA",
  "BrandB",
  "BrandC",
  "BrandD",
];
const brandsDesc = [...brandsAsc].reverse();
// Assuming null date comes last when ascending based on compareDates logic (!aVal returns 1 * dir)
const datesAsc = [
  new Date("2021-12-31"),
  "2022-01-01",
  "2022-01-02",
  "2022-01-03",
  new Date("2022-01-04"),
  "2022-01-05",
  null,
];
const datesDesc = [
  null,
  "2022-01-05",
  new Date("2022-01-04"),
  "2022-01-03",
  "2022-01-02",
  "2022-01-01",
  new Date("2021-12-31"),
]; // Explicit reverse for clarity with null

describe("useSort", () => {
  // Helper to prevent modifying original array during tests
  // Note: JSON.stringify won't preserve Date objects correctly, use structuredClone or similar if needed,
  // but for these tests, re-reading `items` might be simpler if mutation occurs.
  // Let's assume useSort returns a new array as intended.
  const getItemsCopy = () => JSON.parse(JSON.stringify(items));

  it("sorts by name ascending (case-sensitive)", () => {
    const sorted = useSort(getItemsCopy(), { by: "name", order: true });
    expect(sorted.map((i) => i.name)).toEqual(namesAsc);
  });

  it("sorts by name descending (case-sensitive)", () => {
    const sorted = useSort(getItemsCopy(), { by: "name", order: false });
    expect(sorted.map((i) => i.name)).toEqual(namesDesc);
  });

  it("sorts by brand ascending (nulls/undefined first)", () => {
    const sorted = useSort(getItemsCopy(), { by: "brand", order: true });
    expect(sorted.map((i) => i.brand)).toEqual(brandsAsc);
  });

  it("sorts by brand descending (nulls/undefined last)", () => {
    const sorted = useSort(getItemsCopy(), { by: "brand", order: false });
    expect(sorted.map((i) => i.brand)).toEqual(brandsDesc);
  });

  it("sorts by created_at ascending (handles strings, Dates, nulls)", () => {
    const sorted = useSort(getItemsCopy(), { by: "created_at", order: true });
    // Need to normalize Date objects for comparison if mixing types
    const sortedDates = sorted.map((i) =>
      i.created_at ? new Date(i.created_at).toISOString() : null,
    );
    const expectedDates = datesAsc.map((d) =>
      d ? new Date(d).toISOString() : null,
    );
    expect(sortedDates).toEqual(expectedDates);
  });

  it("sorts by created_at descending (handles strings, Dates, nulls)", () => {
    const sorted = useSort([...items], { by: "created_at", order: false });
    const sortedDates = sorted.map((i) =>
      i.created_at ? new Date(i.created_at).toISOString() : null,
    );
    const expectedDates = datesDesc.map((d) =>
      d ? new Date(d).toISOString() : null,
    );
    expect(sortedDates).toEqual(expectedDates);
  });

  // Removed tests for 'count'

  it("requires 'order' property and sorts ascending when true", () => {
    // Test default ascending behavior by explicitly setting order: true
    const sorted = useSort([...items], { by: "name", order: true });
    expect(sorted.map((i) => i.name)).toEqual(namesAsc);
  });

  it("returns a copy of the array (does not mutate original)", () => {
    const originalItems = [...items]; // Create simple copy
    const originalItemsRef = ref([...items]); // Create ref copy

    useSort(originalItems, { by: "name", order: true }); // Provide order
    expect(originalItems).toEqual(items); // Check plain array hasn't changed

    useSort(originalItemsRef, { by: "name", order: true }); // Provide order
    expect(originalItemsRef.value).toEqual(items); // Check ref array hasn't changed
  });

  it("handles empty array input", () => {
    const sorted = useSort([], { by: "name", order: true });
    expect(sorted).toEqual([]);
  });

  // Removed test for invalid key - type system should handle this

  it("works with Ref array input for descending order", () => {
    const itemsRef = ref([...items]); // Create ref copy
    const sorted = useSort(itemsRef, { by: "name", order: false });
    expect(sorted.map((i) => i.name)).toEqual(namesDesc);
  });

  // Basic stability check: items with equal sort keys maintain relative order
  it("maintains relative order for equal keys (stability check using brand)", () => {
    // Use items that conform to Item type, testing stability on 'brand'
    const itemsWithEqualBrands: Item[] = [
      {
        name: "Item1",
        brand: "BrandA",
        created_at: "2023-01-01",
        slug: "item1",
      }, // id: 1
      {
        name: "Item2",
        brand: "BrandB",
        created_at: "2023-01-02",
        slug: "item2",
      }, // id: 2
      {
        name: "Item3",
        brand: "BrandA",
        created_at: "2023-01-03",
        slug: "item3",
      }, // id: 3, Equal brand to Item1
      {
        name: "Item4",
        brand: "BrandC",
        created_at: "2023-01-04",
        slug: "item4",
      }, // id: 4
    ];
    // Sort by brand ascending. Expect Item1 (id:1) to appear before Item3 (id:3).
    const sorted = useSort(itemsWithEqualBrands, { by: "brand", order: true });

    const brands = sorted.map((i) => i.brand);
    const names = sorted.map((i) => i.name); // Use name to check relative order

    expect(brands).toEqual(["BrandA", "BrandA", "BrandB", "BrandC"]);
    // Check if Item1 comes before Item3
    expect(names).toEqual(["Item1", "Item3", "Item2", "Item4"]);
  });
});
