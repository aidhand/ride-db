export const useItems = () => {
  return useQuery({
    key: ["items"],
    query: ({ signal }) => {
      const requestFetch = useRequestFetch();
      return requestFetch("/api/items", {
        signal,
        method: "GET",
      });
    },
  });
};

export function useItemsByBrand(
  brand: string,
  options?: {
    limit?: number;
    offset?: number;
  },
) {
  return useQuery({
    key: ["items", "brand", brand],
    query: ({ signal }) => {
      const requestFetch = useRequestFetch();
      return requestFetch(
        `/api/items?brand=${brand}${options?.limit ? `&limit=${options.limit}` : ""}${options?.offset ? `&offset=${options.offset}` : ""}`,
        {
          signal,
          method: "GET",
        },
      );
    },
  });
}

export function useItemsByCategory(category: string) {
  return useQuery({
    key: ["items", "category", category],
    query: ({ signal }) => {
      const requestFetch = useRequestFetch();
      return requestFetch(`/api/items?category=${category}`, {
        signal,
        method: "GET",
      });
    },
  });
}

export function useItem(slug: string) {
  return useQuery({
    key: ["item", slug],
    query: ({ signal }) => {
      const requestFetch = useRequestFetch();
      return requestFetch(`/api/items/${slug}`, {
        signal,
        method: "GET",
      });
    },
  });
}
