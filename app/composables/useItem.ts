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
