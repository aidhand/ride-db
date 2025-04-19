import { useSorted } from '@vueuse/core';

interface SortableColumns {
  name: string;
  brand?: string | null;
  created_at: Date | string | null;
  slug?: string; // Adding slug for item links
}

export function useSort<T extends SortableColumns>(
  items: Ref<T[]> | T[],
  sort: {
    by: keyof SortableColumns;
    order: boolean;
  }
) {
  const actualItems = unref(items);
  return useSorted(actualItems, (a, b) => {
    const dir = sort.order ? 1 : -1;

    const aVal = a[sort.by];
    const bVal = b[sort.by];

    switch (sort.by) {
      case 'name':
      case 'brand':
        return ((aVal as string) || '').localeCompare((bVal as string) || '') * dir;
      case 'created_at':
        if (!aVal && !bVal) return 0;
        if (!aVal) return 1 * dir;
        if (!bVal) return -1 * dir;

        const aDate = aVal instanceof Date ? aVal : new Date(aVal as string);
        const bDate = bVal instanceof Date ? bVal : new Date(bVal as string);
        return (aDate.getTime() - bDate.getTime()) * dir;
      default:
        return 0;
    }
  }).value;
}
