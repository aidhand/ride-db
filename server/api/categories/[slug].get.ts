import { eq, sql } from "drizzle-orm";
import { tables, useDB } from "~~/server/utils/db";

// Retrieves a single category from the database by its slug.
export default eventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");

  if (!slug) {
    throw createError({
      statusCode: 400,
      message: "Category slug is required",
    });
  }

  const db = useDB();
  const query = db
    .select()
    .from(tables.categories)
    .where(eq(tables.categories.slug, sql.placeholder("slug")))
    .limit(1)
    .prepare("getCategoryBySlug");

  const categories = await query.execute({ slug });

  if (!categories.length) {
    throw createError({
      statusCode: 404,
      message: `Category with slug "${slug}" not found`,
    });
  }

  return categories[0];
});
