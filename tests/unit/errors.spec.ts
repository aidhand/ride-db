import type { NuxtError } from "#app";
import { describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";
import { isNuxtZodError } from "../../app/utils/errors";

// Mock Nuxt's isNuxtError
const mockIsNuxtError = vi.fn();
vi.mock("#app", () => ({
  isNuxtError: mockIsNuxtError,
}));

describe("isNuxtZodError", () => {
  it("should return true for a NuxtError containing a ZodError in data.data", () => {
    const zodError = new ZodError([]);
    const nuxtError: NuxtError<{ data: ZodError }> = {
      message: "Validation Error",
      statusCode: 400,
      statusMessage: "Bad Request",
      data: { data: zodError }, // Nested data structure assumed by the function
      fatal: false,
      unhandled: false,
      toJSON: () => ({
        // Update toJSON mock
        message: "Validation Error",
        statusCode: 400,
        statusMessage: "Bad Request",
        data: { data: zodError },
      }),
      name: "NuxtError",
    };
    mockIsNuxtError.mockReturnValue(true);
    expect(isNuxtZodError(nuxtError)).toBe(true);
    expect(mockIsNuxtError).toHaveBeenCalledWith(nuxtError);
  });

  it("should return false if isNuxtError returns false", () => {
    const notANuxtError = new Error("Just a regular error");
    mockIsNuxtError.mockReturnValue(false);
    expect(isNuxtZodError(notANuxtError)).toBe(false);
    expect(mockIsNuxtError).toHaveBeenCalledWith(notANuxtError);
  });

  it("should return false for a NuxtError without data", () => {
    const nuxtError: NuxtError = {
      message: "Server Error",
      statusCode: 500,
      statusMessage: "Internal Server Error",
      // No data property
      fatal: false,
      unhandled: false,
      toJSON: () => ({
        // Update toJSON mock
        message: "Server Error",
        statusCode: 500,
        statusMessage: "Internal Server Error",
        // data: undefined, // data is optional here
      }),
      name: "NuxtError",
    };
    mockIsNuxtError.mockReturnValue(true);
    expect(isNuxtZodError(nuxtError)).toBe(false);
  });

  it("should return false for a NuxtError with data, but not the nested data structure", () => {
    const nuxtError: NuxtError<{ someOtherData: string }> = {
      message: "Some Error",
      statusCode: 404,
      statusMessage: "Not Found",
      data: { someOtherData: "value" }, // Incorrect data structure
      fatal: false,
      unhandled: false,
      toJSON: () => ({
        // Update toJSON mock
        message: "Some Error",
        statusCode: 404,
        statusMessage: "Not Found",
        data: { someOtherData: "value" },
      }),
      name: "NuxtError",
    };
    mockIsNuxtError.mockReturnValue(true);
    expect(isNuxtZodError(nuxtError)).toBe(false);
  });

  it("should return false for a NuxtError with data.data, but not a ZodError", () => {
    const nuxtError: NuxtError<{ data: Error }> = {
      message: "Another Error",
      statusCode: 403,
      statusMessage: "Forbidden",
      data: { data: new Error("Not a ZodError") }, // data.data is not a ZodError
      fatal: false,
      unhandled: false,
      toJSON: () => ({
        // Update toJSON mock
        message: "Another Error",
        statusCode: 403,
        statusMessage: "Forbidden",
        data: { data: new Error("Not a ZodError") },
      }),
      name: "NuxtError",
    };
    mockIsNuxtError.mockReturnValue(true);
    expect(isNuxtZodError(nuxtError)).toBe(false);
  });

  it("should return false for null input", () => {
    mockIsNuxtError.mockReturnValue(false); // isNuxtError would return false for null
    expect(isNuxtZodError(null)).toBe(false);
  });

  it("should return false for undefined input", () => {
    mockIsNuxtError.mockReturnValue(false); // isNuxtError would return false for undefined
    expect(isNuxtZodError(undefined)).toBe(false);
  });

  it("should return false for a plain object", () => {
    const plainObject = { message: "I am an object" };
    mockIsNuxtError.mockReturnValue(false);
    expect(isNuxtZodError(plainObject)).toBe(false);
  });
});
