import { unref, type Ref } from "vue";

// This is what fields we can accept from the items
interface FilterFields {
  name?: string | null;
  brand?: string | null;
  category?: string | null;
}

// This is what we can accept from the filtering options
interface FilterOptions {
  name?: string | null;
  brands?: string[] | string;
  categories?: string[] | string;
}
export function useFilter<T extends FilterFields>(
  items: Ref<T[]> | T[],
  filter?: FilterOptions,
) {
  const actualItems = unref(items);

  if (!filter) return actualItems;

  return actualItems.filter((item) => {
    const match = {
      name: true,
      brand: true,
      category: true,
    };

    // Filter by name if name filter is provided
    if (filter.name) {
      const itemName = item.name?.toLocaleLowerCase();
      const filterName = filter.name.toLocaleLowerCase();
      match.name = itemName?.includes(filterName) ?? false;
    }

    // Filter by brand if brand filter is provided
    if (filter.brands && filter.brands.length > 0) {
      const itemBrand = item.brand?.toLocaleLowerCase();
      const filterBrands = Array.isArray(filter.brands)
        ? filter.brands.map((b) => b.toLocaleLowerCase())
        : [filter.brands.toLocaleLowerCase()];
      match.brand = itemBrand ? filterBrands.includes(itemBrand) : false;
    }

    // Filter by category if category filter is provided
    if (filter.categories && filter.categories.length > 0) {
      const itemCategory = item.category?.toLocaleLowerCase();
      const filterCategories = Array.isArray(filter.categories)
        ? filter.categories.map((c) => c.toLocaleLowerCase())
        : [filter.categories.toLocaleLowerCase()];
      match.category = itemCategory
        ? filterCategories.includes(itemCategory)
        : false;
    }

    return match.name && match.brand && match.category;
  });
}
