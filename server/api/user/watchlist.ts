import { eq } from "drizzle-orm";

export default eventHandler(async (event) => {
  const session = await getUserSession(event);

  const db = useDB();

  // Make sure user exists before creating watchlist
  if (!session.user?.slug) {
    throw createError({
      statusCode: 401,
    });
  }

  const watchlistSlug = `${session.user.slug}-watchlist`;

  // Create a watchlist if the user doesn't have one
  await db
    .insert(tables.lists)
    .values({
      slug: watchlistSlug,
      name: "Watchlist",
      user: session.user.slug,
    })
    .onConflictDoNothing();

  // Get items which are in the user's watchlist
  return await db
    .select()
    .from(tables.lists)
    .where(eq(tables.lists.slug, watchlistSlug))
    .limit(1);
});
