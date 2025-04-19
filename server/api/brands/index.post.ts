import { sql } from "drizzle-orm";
import { useValidatedBody, z } from "h3-zod";

const brandInputSchema = z.object({
  name: z.string().min(2).max(32),
});

export default eventHandler(async (event) => {
  const { _ } = await requireUserSession(event);
  const { name } = await useValidatedBody(event, brandInputSchema);

  // TODO: Check if the user has permission to create a brand.
  // if (!user.permissions.includes('create_brand')) {
  //   throw createError({ statusCode: 403, statusMessage: 'Forbidden' });
  // }

  // Generate a slug from the brand name
  const slug = slugify(name);

  // Check if the slug already exists
  const db = useDB();
  const query = db
    .insert(tables.brands)
    .values({
      name: sql.placeholder("name"),
      slug: sql.placeholder("slug"),
    })
    .onConflictDoNothing()
    .returning()
    .prepare("insertBrand");

  const results = await query.execute({ name, slug });

  if (!results.length) {
    throw createError({ statusCode: 400 });
  }

  return results;
});
