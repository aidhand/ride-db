import { eq } from "drizzle-orm";
import { useValidatedBody, z } from "h3-zod";

const brandUpdateSchema = z.object({
  name: z.string().min(2).max(32),
  updateSlug: z.boolean().optional().default(false),
});

// Updates a brand in the database.
export default eventHandler(async (event) => {
  // Ensure the user is authenticated before updating a brand.
  const { user } = await requireUserSession(event);

  // TODO: Check if the user has permission to update a brand.
  // if (!user.permissions.includes('update_brand')) {
  //   throw createError({ statusCode: 403, statusMessage: 'Forbidden' });
  // }

  const currentSlug = getRouterParam(event, "slug");

  if (!currentSlug) {
    throw createError({
      statusCode: 400,
      message: "Brand slug is required",
    });
  }

  // Validate the request body against the schema.
  const { name, updateSlug } = await useValidatedBody(event, brandUpdateSchema);

  // If updateSlug is true, generate a new slug from the name
  let updateData: { name: string; slug?: string } = { name };

  if (updateSlug) {
    let newSlug = slugify(name);

    // Check if the new slug already exists and is different from current slug
    if (newSlug !== currentSlug) {
      const existingBrand = await useDB()
        .select()
        .from(tables.brands)
        .where(eq(tables.brands.slug, newSlug))
        .limit(1);

      // If the slug already exists, append a random string
      if (existingBrand.length > 0) {
        const randomSuffix = Math.random().toString(36).substring(2, 7);
        newSlug = `${newSlug}-${randomSuffix}`;
      }

      // Add slug to update data
      updateData.slug = newSlug;
    }
  }

  const updated = await useDB()
    .update(tables.brands)
    .set(updateData)
    .where(eq(tables.brands.slug, currentSlug))
    .returning();

  if (!updated.length) {
    throw createError({
      statusCode: 404,
      message: `Brand with slug "${currentSlug}" not found`,
    });
  }

  return updated[0];
});
