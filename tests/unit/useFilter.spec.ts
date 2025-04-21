import { describe, expect, it } from "vitest";
import { ref } from "vue";
import { useFilter } from "~/composables/useFilter";

type Item = {
  name?: string | null;
  brand?: string | null;
  category?: string | null;
  price?: number | null; // Add another property for testing
};

const items: Item[] = [
  { name: "Apple", brand: "brandA", category: "cat1", price: 10 },
  { name: "Banana", brand: "brandB", category: "cat2", price: 5 },
  { name: "Apricot", brand: "brandA", category: "cat1", price: 12 },
  { name: "Orange", brand: "brandC", category: null, price: 8 }, // Null category
  { name: null, brand: "brandA", category: "cat1", price: 15 }, // Null name
  { name: "Grape", brand: null, category: "cat3", price: 7 }, // Null brand
  { name: "Pear", brand: "brandB", category: "cat2" }, // Undefined price
];

describe("useFilter", () => {
  const baseItemsCount = items.length;

  it("returns all items when filter is undefined", () => {
    const result = useFilter(items, undefined);
    expect(result).toHaveLength(baseItemsCount);
    // Use toMatchObject to avoid strict equality issues with potential reactive wrappers
    expect(result).toMatchObject(items);
  });

  it("returns all items when filter is an empty object", () => {
    const result = useFilter(items, {});
    expect(result).toHaveLength(baseItemsCount);
    expect(result).toMatchObject(items);
  });

  it("filters by name case-insensitive and partial, ignoring null names", () => {
    const result = useFilter(items, { name: "ap" });
    // Expecting Apple, Apricot, Grape
    expect(result).toHaveLength(3);
    expect(result.map((i) => i.name)).toEqual(["Apple", "Apricot", "Grape"]);
    const resultUpper = useFilter(items, { name: "AP" });
    expect(resultUpper).toHaveLength(3);
    expect(resultUpper.map((i) => i.name)).toEqual([
      "Apple",
      "Apricot",
      "Grape",
    ]);
  });

  it("filters by brand exact match, ignoring null brands", () => {
    const result = useFilter(items, { brand: "brandA" });
    // Expecting Apple, Apricot, and the item with null name
    expect(result).toHaveLength(3);
    expect(result.every((i) => i.brand === "brandA")).toBe(true);
    // Test case sensitivity (assuming it should be exact)
    const resultLower = useFilter(items, { brand: "branda" });
    expect(resultLower).toHaveLength(0);
  });

  it("filters by category exact match, ignoring null categories", () => {
    const result = useFilter(items, { category: "cat2" });
    // Expecting Banana, Pear
    expect(result).toHaveLength(2);
    expect(result.map((i) => i.name)).toEqual(["Banana", "Pear"]);
    // Test case sensitivity (assuming it should be exact)
    const resultLower = useFilter(items, { category: "CAT2" });
    expect(resultLower).toHaveLength(0);
  });

  it("combines multiple filters with AND logic", () => {
    const result = useFilter(items, {
      name: "ap", // Matches Apple, Apricot, Grape
      brand: "brandA", // Matches Apple, Apricot, null-name-item
      category: "cat1", // Matches Apple, Apricot, null-name-item
    });
    // Only Apple and Apricot match all three
    expect(result).toHaveLength(2);
    expect(result.map((i) => i.name)).toEqual(["Apple", "Apricot"]);
  });

  it("handles combined filters resulting in no matches", () => {
    const result = useFilter(items, { name: "Apple", brand: "brandB" });
    expect(result).toEqual([]);
  });

  it("ignores filter criteria with null or undefined values", () => {
    // Test with undefined explicitly
    const resultNameUndef = useFilter(items, { name: undefined });
    expect(resultNameUndef).toHaveLength(baseItemsCount);

    const resultBrandUndef = useFilter(items, { brand: undefined });
    expect(resultBrandUndef).toHaveLength(baseItemsCount);

    // Test with undefined explicitly for category
    const resultMixed = useFilter(items, {
      name: "Banana",
      category: undefined,
    });
    expect(resultMixed).toHaveLength(1); // Only filters by name
    // Add check before accessing index and use optional chaining
    if (resultMixed.length > 0) {
      expect(resultMixed[0]?.name).toBe("Banana");
    }
  });

  it("ignores filter criteria for properties not present on items", () => {
    // Use @ts-expect-error to indicate intentional type error for testing
    // @ts-expect-error - Testing with a non-existent property
    const result = useFilter(items, { nonExistentProp: "value" });
    expect(result).toHaveLength(baseItemsCount);

    // Use @ts-expect-error to indicate intentional type error for testing
    // @ts-expect-error - Testing with a non-existent property
    const resultMixed = useFilter(items, {
      name: "Pear",
      nonExistentProp: "value",
    });
    expect(resultMixed).toHaveLength(1);
    // Add check before accessing index and use optional chaining
    if (resultMixed.length > 0) {
      expect(resultMixed[0]?.name).toBe("Pear");
    }
  });

  it("handles items with null/undefined values for filtered properties", () => {
    // Filter by category 'cat1', should exclude item with null category
    const resultCat = useFilter(items, { category: "cat1" });
    expect(resultCat).toHaveLength(3); // Apple, Apricot, null-name-item
    expect(resultCat.every((i) => i.category === "cat1")).toBe(true);

    // Filter by brand 'brandA', should exclude item with null brand
    const resultBrand = useFilter(items, { brand: "brandA" });
    expect(resultBrand).toHaveLength(3); // Apple, Apricot, null-name-item
    expect(resultBrand.every((i) => i.brand === "brandA")).toBe(true);

    // Filter by name 'Orange', should exclude item with null name
    const resultName = useFilter(items, { name: "Orange" });
    expect(resultName).toHaveLength(1);
    // Add check before accessing index and use optional chaining
    if (resultName.length > 0) {
      expect(resultName[0]?.name).toBe("Orange");
    }
  });

  it("works with Ref array input", () => {
    const itemsRef = ref([...items]); // Create a ref copy
    const result = useFilter(itemsRef, { brand: "brandB" });
    // Expecting Banana, Pear
    expect(result).toHaveLength(2);
    // Add check before accessing index (though map handles empty array)
    if (result.length > 0) {
      expect(result.map((i) => i.name)).toEqual(["Banana", "Pear"]);
    }
  });
});
