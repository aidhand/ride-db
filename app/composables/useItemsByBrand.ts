export function useItemsByBrand(brand: string) {
  return useQuery({
    key: ["items", brand],
    query: ({ signal }) => {
      const requestFetch = useRequestFetch();
      return requestFetch(`/api/items?brand=${brand}`, {
        signal,
        method: "GET",
      });
    },
  });
}
