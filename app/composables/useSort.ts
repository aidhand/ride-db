import { useSorted } from "@vueuse/core";
import { unref, type Ref } from "vue";

interface SortableColumns {
  name: string;
  brand?: string | null;
  category?: string | null; // Add category
  created_at: Date | string | null;
  slug?: string; // Adding slug for item links
}

// Helper functions to reduce complexity
function compareStrings(
  aVal: string | null | undefined,
  bVal: string | null | undefined,
  dir: number,
): number {
  return (aVal || "").localeCompare(bVal || "") * dir;
}

function compareDates(
  aVal: Date | string | null | undefined,
  bVal: Date | string | null | undefined,
  dir: number,
): number {
  if (!(aVal || bVal)) return 0;
  if (!aVal) return 1 * dir;
  if (!bVal) return -1 * dir;

  const aDate = aVal instanceof Date ? aVal : new Date(aVal as string);
  const bDate = bVal instanceof Date ? bVal : new Date(bVal as string);
  return (aDate.getTime() - bDate.getTime()) * dir;
}

export function useSort<T extends SortableColumns>(
  items: Ref<T[]> | T[],
  sort: {
    by: keyof SortableColumns;
    order: boolean;
  },
) {
  const actualItems = unref(items);
  return useSorted(actualItems, (a, b) => {
    const dir = sort.order ? 1 : -1;

    // Get values of items using the key
    const aVal = a[sort.by as keyof typeof a];
    const bVal = b[sort.by as keyof typeof b];

    // Handle cases where values are equal
    if (aVal === bVal) return 0;

    switch (sort.by) {
      case "name":
      case "brand":
      case "category": {
        // Add category case
        return compareStrings(aVal as string, bVal as string, dir);
      }
      case "created_at": {
        return compareDates(
          aVal as Date | string | null,
          bVal as Date | string | null,
          dir,
        );
      }
      default:
        return 0;
    }
  }).value;
}
