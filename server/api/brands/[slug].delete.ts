import { eq } from "drizzle-orm";

// Deletes a brand from the database.
export default eventHandler(async (event) => {
  // Ensure the user is authenticated before deleting a brand.
  const { user } = await requireUserSession(event);

  // TODO: Check if the user has permission to delete a brand.
  // if (!user.permissions.includes('delete_brand')) {
  //   throw createError({ statusCode: 403, statusMessage: 'Forbidden' });
  // }

  const slug = getRouterParam(event, "slug");

  if (!slug) {
    throw createError({
      statusCode: 400,
      message: "Brand slug is required",
    });
  }

  // Check if the brand exists first
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

  // Check if any items are using this brand
  const items = await useDB()
    .select()
    .from(tables.items)
    .where(eq(tables.items.brand, slug))
    .limit(1);

  if (items.length) {
    throw createError({
      statusCode: 409,
      message: `Cannot delete brand because it is used by at least one item`,
    });
  }

  // Delete the brand
  await useDB().delete(tables.brands).where(eq(tables.brands.slug, slug));

  return { message: `Brand "${slug}" deleted successfully` };
});
