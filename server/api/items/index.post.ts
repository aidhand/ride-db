import { eq, sql } from "drizzle-orm";
import { useValidatedBody, z } from "h3-zod";

const itemInputSchema = z.object({
  name: z.string().min(2).max(100),
  brand: z.string().min(2).max(32),
});

export default eventHandler(async (event) => {
  const { _ } = await requireUserSession(event);
  const { name, brand } = await useValidatedBody(event, itemInputSchema);

  // TODO: Check if the user has permission to create an item.
  // if (!user.permissions.includes('create_item')) {
  //   throw createError({ statusCode: 403, statusMessage: 'Forbidden' });
  // }

  // Generate a slug from the item name
  const slug = slugify(name);

  // Check if the brand exists
  const db = useDB();
  const brandCheck = await db
    .select()
    .from(tables.brands)
    .where(eq(tables.brands.slug, brand))
    .limit(1);

  if (!brandCheck.length) {
    throw createError({
      statusCode: 400,
      statusMessage: `Brand "${brand}" does not exist`,
    });
  }

  // Insert the new item
  const query = db
    .insert(tables.items)
    .values({
      name: sql.placeholder("name"),
      slug: sql.placeholder("slug"),
      brand: sql.placeholder("brand"),
    })
    .onConflictDoNothing()
    .returning()
    .prepare("insertItem");

  const results = await query.execute({ name, slug, brand });

  if (!results.length) {
    throw createError({
      statusCode: 400,
      statusMessage: "Unable to create item, slug may already exist",
    });
  }

  return results;
});
