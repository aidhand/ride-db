import { eq, sql } from "drizzle-orm";
import type { Item } from "~~/server/utils/db";
import { tables, useDB } from "~~/server/utils/db";

// Retrieves a single item by its slug
export default eventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");

  if (!slug) {
    throw createError({
      statusCode: 400,
      message: "Item slug is required",
    });
  }

  const db = useDB();
  const query = db
    .select()
    .from(tables.items)
    .where(eq(tables.items.slug, sql.placeholder("slug")))
    .limit(1)
    .prepare("getItemBySlug");

  const items = await query.execute({ slug });

  if (!items.length) {
    throw createError({
      statusCode: 404,
      message: `Item with slug "${slug}" not found`,
    });
  }

  return items[0] as Item;
});
