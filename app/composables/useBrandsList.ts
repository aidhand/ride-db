/**
 * Composable to fetch and sort the list of brands
 * Uses Pinia Colada's useQuery for data fetching
 */
export const useBrandsList = () => {
  const query = useQuery({
    key: ["brands"],
    query: ({ signal }) => useRequestFetch()("/api/brands", { signal }),
  });

  return query;
};
