import { describe, expect, it, vi } from "vitest";
// Adjust the import path if necessary
import { useItem, useItems } from "../../app/composables/items";

// Mock Nuxt's useRequestFetch
const mockRequestFetch = vi.fn();
vi.mock("#app", () => ({
  useRequestFetch: () => mockRequestFetch,
}));

// Mock useQuery (similar to brands.spec.ts)
const mockUseQuery = vi.fn((options) => ({
  data: undefined,
  isLoading: false,
  error: null,
  refetch: vi.fn(),
  _queryFnResult: options.query
    ? options.query({ signal: undefined })
    : undefined,
}));
vi.mock("@tanstack/vue-query", async (importOriginal) => {
  const actual = await importOriginal();
  const actualObject =
    typeof actual === "object" && actual !== null ? actual : {};
  return {
    ...actualObject,
    useQuery: mockUseQuery,
  };
});

describe("useItems Composable", () => {
  it("should call useQuery with correct key and query function", () => {
    useItems();

    expect(mockUseQuery).toHaveBeenCalled();
    const queryOptions = mockUseQuery.mock.calls[0]![0]!;

    expect(queryOptions.key).toEqual(["items"]);
    expect(mockRequestFetch).toHaveBeenCalledWith("/api/items", {
      signal: undefined,
      method: "GET",
    });
  });
});

describe("useItem Composable", () => {
  it("should call useQuery with correct key and query function for a given slug", () => {
    const testSlug = "test-item-slug";
    useItem(testSlug);

    // Reset mocks if necessary or check call count if running sequentially in one file
    // expect(mockUseQuery).toHaveBeenCalledTimes(2); // Adjust if needed
    expect(mockUseQuery).toHaveBeenCalled();
    // Get the latest call's options
    const queryOptions =
      mockUseQuery.mock.calls[mockUseQuery.mock.calls.length - 1]![0]!;

    expect(queryOptions.key).toEqual(["item", testSlug]);
    expect(mockRequestFetch).toHaveBeenCalledWith(`/api/items/${testSlug}`, {
      signal: undefined,
      method: "GET",
    });
  });
});
