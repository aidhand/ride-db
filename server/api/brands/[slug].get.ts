import { eq, sql } from 'drizzle-orm';
import { tables, useDB } from '~~/server/utils/db';

// Retrieves a single brand from the database by its slug.
export default eventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');

  if (!slug) {
    throw createError({
      statusCode: 400,
      message: 'Brand slug is required',
    });
  }

  const db = useDB();
  const query = db
    .select()
    .from(tables.brands)
    .where(eq(tables.brands.slug, sql.placeholder('slug')))
    .limit(1)
    .prepare('getBrandBySlug');

  const brands = await query.execute({ slug });

  if (!brands.length) {
    throw createError({
      statusCode: 404,
      message: `Brand with slug "${slug}" not found`,
    });
  }

  return brands[0];
});
