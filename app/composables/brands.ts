export function useBrands() {
  return useQuery({
    key: ['brands'],
    query: ({ signal }) => {
      const requestFetch = useRequestFetch();
      return requestFetch('/api/brands', {
        signal,
        method: 'GET',
      });
    },
  });
}
export function useBrand(slug: string) {
  return useQuery({
    key: ['brand', slug],
    query: ({ signal }) => {
      const requestFetch = useRequestFetch();
      return requestFetch(`/api/brands/${slug}`, {
        signal,
        method: 'GET',
      });
    },
  });
}
