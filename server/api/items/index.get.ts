import { and, ilike, sql } from "drizzle-orm";

interface ItemFilterOptions {
  name?: string;
  brand?: string;
  category?: string;

  limit?: number;
  offset?: number;
  sortBy?: "name" | "created_at" | "updated_at";
  sortOrder?: "asc" | "desc";
}

// Retrieves items filtered by name, brand slug, or category via query param.
export default eventHandler(async (event) => {
  const options = getQuery(event) as ItemFilterOptions;

  const db = useDB();
  const query = db
    .select()
    .from(tables.items)
    .where(
      and(
        ilike(tables.items.name, sql.placeholder("name")),
        ilike(tables.items.brand, sql.placeholder("brand")),
        ilike(tables.items.category, sql.placeholder("category")),
      ),
    )
    .limit(sql.placeholder("limit"))
    .offset(sql.placeholder("offset"))
    .prepare("filteredItems");

  const results = await query.execute({
    name: `%${options.name || "%"}%`,
    brand: `%${options.brand || "%"}%`,
    category: `%${options.category || "%"}%`,
    limit: options.limit,
    offset: options.offset,
  });

  return results;
});
