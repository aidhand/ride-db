/**
 * Utility functions for string manipulation
 */

/**
 * Converts a string into a URL-friendly slug
 * @param text The text to convert into a slug
 * @returns A URL-friendly slug version of the text
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w-]+/g, "") // Remove all non-word characters except hyphens
    .replace(/--+/g, "-"); // Replace multiple - with single -
}
