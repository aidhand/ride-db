import { and, ilike, sql } from 'drizzle-orm';

interface BrandFilterOptions {
  name?: string;

  limit?: number;
  offset?: number;
  sortBy?: 'name' | 'created_at' | 'updated_at';
  sortOrder?: 'asc' | 'desc';
}
export default eventHandler(async (event) => {
  const options = getQuery(event) as BrandFilterOptions;

  const db = useDB();
  const query = db
    .select()
    .from(tables.brands)
    .where(and(ilike(tables.brands.name, sql.placeholder('name'))))
    .limit(sql.placeholder('limit'))
    .offset(sql.placeholder('offset'))
    .prepare('filteredBrands');

  const results = await query.execute({
    name: `%${options.name || '%'}%`,
    limit: options.limit,
    offset: options.offset,
  });

  return results;
});
