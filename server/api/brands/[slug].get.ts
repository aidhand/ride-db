import { eq } from "drizzle-orm";

// Retrieves a single brand from the database by its slug.
export default eventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");

  if (!slug) {
    throw createError({
      statusCode: 400,
      message: "Brand slug is required",
    });
  }

  const brand = await useDB()
    .select()
    .from(tables.brands)
    .where(eq(tables.brands.slug, slug))
    .limit(1);

  if (!brand.length) {
    throw createError({
      statusCode: 404,
      message: `Brand with slug "${slug}" not found`,
    });
  }

  return brand[0];
});
