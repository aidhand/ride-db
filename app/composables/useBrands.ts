export function useBrands() {
  return useQuery({
    key: ["brands"],
    query: ({ signal }) => {
      const requestFetch = useRequestFetch();
      return requestFetch("/api/brands", {
        signal,
        method: "GET",
      });
    },
  });
}
