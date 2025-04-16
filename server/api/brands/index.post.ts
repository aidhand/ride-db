import { useValidatedBody, z } from "h3-zod";

const brandInputSchema = z.object({
  name: z.string().min(2).max(32),
});

// Creates a new brand in the database.
export default eventHandler(async (event) => {
  // Ensure the user is authenticated before creating a brand.
  const { user } = await requireUserSession(event);

  // TODO: Check if the user has permission to create a brand.

  // if (!user.permissions.includes('create_brand')) {
  //   throw createError({ statusCode: 403, statusMessage: 'Forbidden' });
  // }

  // Validate the request body against the schema.
  const { name } = await useValidatedBody(event, brandInputSchema);

  // Generate a slug from the brand name
  let slug = slugify(name);

  // Check if the slug already exists
  const existingBrand = await useDB()
    .select()
    .from(tables.brands)
    .where(eq(tables.brands.slug, slug))
    .limit(1);

  // If the slug already exists, append a random string
  if (existingBrand.length > 0) {
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    slug = `${slug}-${randomSuffix}`;
  }

  // Insert the brand with name and slug
  const brand = await useDB()
    .insert(tables.brands)
    .values({
      name,
      slug,
    })
    .returning();

  return brand[0];
});
