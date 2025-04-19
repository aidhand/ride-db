export function useItems() {
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
}
