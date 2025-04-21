import { describe, expect, it, vi } from "vitest";
import { useBrand, useBrands } from "../../app/composables/brands";

// Mock Nuxt's useRequestFetch
const mockRequestFetch = vi.fn();
vi.mock("#app", () => ({
  useRequestFetch: () => mockRequestFetch,
}));

// Mock useQuery (assuming a simple structure for demonstration)
const mockUseQuery = vi.fn((options) => ({
  data: undefined, // Mock data structure
  isLoading: false,
  error: null,
  refetch: vi.fn(),
  // Simulate calling the query function immediately for testing args
  _queryFnResult: options.query
    ? options.query({ signal: undefined })
    : undefined,
}));
vi.mock("@tanstack/vue-query", async (importOriginal) => {
  const actual = await importOriginal();
  // Ensure 'actual' is an object before spreading
  const actualObject =
    typeof actual === "object" && actual !== null ? actual : {};
  return {
    ...actualObject, // Use the validated object
    useQuery: mockUseQuery,
  };
});

describe("useBrands Composable", () => {
  it("should call useQuery with correct key and query function", () => {
    useBrands();

    expect(mockUseQuery).toHaveBeenCalled();
    // Add non-null assertion as the test expects this call
    const queryOptions = mockUseQuery.mock.calls[0]![0]!;

    // Check the query key
    expect(queryOptions.key).toEqual(["brands"]);

    // Check if the query function calls useRequestFetch correctly
    expect(mockRequestFetch).toHaveBeenCalledWith("/api/brands", {
      signal: undefined, // Signal is passed from query fn args
      method: "GET",
    });
  });
});

describe("useBrand Composable", () => {
  it("should call useQuery with correct key and query function for a given slug", () => {
    const testSlug = "test-brand-slug";
    useBrand(testSlug);

    expect(mockUseQuery).toHaveBeenCalledTimes(2); // Ensure it was called again
    // Add non-null assertion as the test expects this call
    const queryOptions = mockUseQuery.mock.calls[1]![0]!;

    // Check the query key includes the slug
    expect(queryOptions.key).toEqual(["brand", testSlug]);

    // Check if the query function calls useRequestFetch correctly with the slug
    expect(mockRequestFetch).toHaveBeenCalledWith(`/api/brands/${testSlug}`, {
      signal: undefined, // Signal is passed from query fn args
      method: "GET",
    });
  });
});
