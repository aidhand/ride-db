import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref, type Ref } from "vue"; // Import ref
import type { RouteLocationNormalized } from "vue-router"; // Import route type
import authMiddleware from "../../app/middleware/auth"; // Import the default export

// Mock Nuxt composables
const mockNavigateTo = vi.fn();
const mockLoggedInState: Ref<boolean> = ref(false); // Use ref() for proper Ref type

vi.mock("#app", async (importOriginal) => {
  const actual = await importOriginal();
  // Ensure 'actual' is an object before spreading
  const actualObject =
    typeof actual === "object" && actual !== null ? actual : {};
  return {
    ...actualObject,
    // Define middleware function signature more accurately
    defineNuxtRouteMiddleware: (
      fn: (
        to: RouteLocationNormalized,
        from: RouteLocationNormalized,
      ) => unknown,
    ) => fn,
    navigateTo: mockNavigateTo,
    // Mock useUserSession
    useUserSession: () => ({
      loggedIn: mockLoggedInState,
    }),
  };
});

describe("Auth Middleware", () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    mockLoggedInState.value = false; // Default to logged out
  });

  it("should redirect to / if user is not logged in", async () => {
    mockLoggedInState.value = false;

    // Execute the middleware function
    // Use more specific types for dummy route objects
    const result = await authMiddleware(
      {} as RouteLocationNormalized,
      {} as RouteLocationNormalized,
    );

    expect(mockNavigateTo).toHaveBeenCalledTimes(1);
    expect(mockNavigateTo).toHaveBeenCalledWith("/");
    // Middleware should return the result of navigateTo when redirecting
    // Add non-null assertion as the test expects the mock to have been called
    expect(result).toBe(mockNavigateTo.mock.results[0]!.value);
  });

  it("should not redirect if user is logged in", async () => {
    mockLoggedInState.value = true;

    // Execute the middleware function
    // Use more specific types for dummy route objects
    const result = await authMiddleware(
      {} as RouteLocationNormalized,
      {} as RouteLocationNormalized,
    );

    expect(mockNavigateTo).not.toHaveBeenCalled();
    // Middleware should return undefined or void when not redirecting
    expect(result).toBeUndefined();
  });
});
