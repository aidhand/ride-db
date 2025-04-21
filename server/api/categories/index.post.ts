import { sql } from "drizzle-orm";
import { useValidatedBody, z } from "h3-zod";

const categoryInputSchema = z.object({
  name: z.string().min(2).max(32),
});

export default eventHandler(async (event) => {
  const { _ } = await requireUserSession(event);
  const { name } = await useValidatedBody(event, categoryInputSchema);

  // TODO: Check if the user has permission to create a category.
  // if (!user.permissions.includes('create_category')) {
  //   throw createError({ statusCode: 403, statusMessage: 'Forbidden' });
  // }

  // Generate a slug from the category name
  const slug = slugify(name);

  // Check if the slug already exists
  const db = useDB();
  const query = db
    .insert(tables.categories)
    .values({
      name: sql.placeholder("name"),
      slug: sql.placeholder("slug"),
    })
    .onConflictDoNothing()
    .returning()
    .prepare("insertCategory");

  const results = await query.execute({ name, slug });

  if (!results.length) {
    throw createError({ statusCode: 400 });
  }

  return results;
});
