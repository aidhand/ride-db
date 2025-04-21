import { and, ilike, sql } from "drizzle-orm";

interface CategoryFilterOptions {
  name?: string;

  limit?: number;
  offset?: number;
  sortBy?: "name" | "created_at" | "updated_at";
  sortOrder?: "asc" | "desc";
}
export default eventHandler(async (event) => {
  const options = getQuery(event) as CategoryFilterOptions;

  const db = useDB();
  const query = db
    .select()
    .from(tables.categories)
    .where(and(ilike(tables.categories.name, sql.placeholder("name"))))
    .limit(sql.placeholder("limit"))
    .offset(sql.placeholder("offset"))
    // TODO: Implement sorting based on sortBy and sortOrder
    .prepare("filteredCategories");

  const results = await query.execute({
    name: `%${options.name || "%"}%`,
    limit: options.limit,
    offset: options.offset,
  });

  return results;
});
