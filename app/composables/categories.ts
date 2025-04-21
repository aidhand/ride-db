export function useCategories(options?: { name?: string }) {
  return useQuery({
    // TODO: make cache key generation more elegant
    key: ["categories", options?.name ? `name-${options.name}` : ""],
    query: ({ signal }) => {
      const requestFetch = useRequestFetch();
      return requestFetch("/api/categories", {
        signal,
        method: "GET",
      });
    },
  });
}
export function useCategory(slug: string) {
  return useQuery({
    key: ["category", slug],
    query: ({ signal }) => {
      const requestFetch = useRequestFetch();
      return requestFetch(`/api/categories/${slug}`, {
        signal,
        method: "GET",
      });
    },
  });
}
