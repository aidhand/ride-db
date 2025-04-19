interface FilterableColumns {
  name?: string;
  brand?: string;
  category?: string;
}

export function useFilter<T extends FilterableColumns>(
  items: Ref<T[]> | T[],
  filter?: { name?: string; brand?: string; category?: string }
) {
  const actualItems = unref(items);

  if (!filter) return actualItems;

  return actualItems.filter((item) => {
    let match = {
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
    if (filter.brand) {
      const itemBrand = item.brand?.toLocaleLowerCase();
      const filterBrand = filter.brand.toLocaleLowerCase();
      match.brand = itemBrand === filterBrand;
    }

    if (filter.category) {
      const itemCategory = item.category?.toLocaleLowerCase();
      const filterCategory = filter.category.toLocaleLowerCase();
      match.category = itemCategory === filterCategory;
    }

    return match.name && match.brand && match.category;
  });
}
