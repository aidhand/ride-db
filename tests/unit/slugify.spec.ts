import { describe, expect, it } from "vitest";
import { slugify } from "~~/shared/utils/slugify";

describe("slugify", () => {
  it("converts text to lowercase", () => {
    expect(slugify("ABC")).toBe("abc");
  });

  it("trims whitespace and replaces spaces with hyphens", () => {
    expect(slugify("  Hello World  ")).toBe("hello-world");
  });

  it("replaces '&' with '-and-'", () => {
    expect(slugify("Rock & Roll")).toBe("rock-and-roll");
  });

  it("removes non-word characters except hyphens", () => {
    expect(slugify("Hello@#World!")).toBe("helloworld");
  });

  it("collapses multiple hyphens into one", () => {
    expect(slugify("a  b")).toBe("a-b");
    expect(slugify("a---b")).toBe("a-b");
  });

  it("handles empty strings", () => {
    expect(slugify("")).toBe("");
  });

  it("handles strings with only whitespace", () => {
    expect(slugify("   ")).toBe("");
  });

  it("handles strings with only special characters", () => {
    expect(slugify("!@#$%^&*()_+")).toBe("");
  });

  it("removes leading and trailing hyphens", () => {
    expect(slugify("-hello-world-")).toBe("hello-world");
  });

  it("handles complex combinations", () => {
    expect(slugify("  Test & Example -- 123!  ")).toBe("test-and-example-123");
  });
});
