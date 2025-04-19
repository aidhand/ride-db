import { tables, useDB } from "../../utils/db";

export default defineOAuthGitHubEventHandler({
  async onSuccess(event, data) {
    const expirySeconds = 60 * 60 * 24 * 14; // 14 days
    const expiryTime = new Date(Date.now() + expirySeconds * 1000);

    // Add the user to the database if needed
    const db = useDB();

    const [user] = await db
      .insert(tables.users)
      .values({
        slug: data.user.login,
        name: data.user.name,
        email: data.user.email,
      })
      .onConflictDoUpdate({
        target: tables.users.email,
        set: {
          slug: data.user.login,
        },
      })
      .returning();

    //  Create a new session or update the existing one
    const [session] = await db
      .insert(tables.sessions)
      .values({
        token: data.tokens.access_token,
        user: user.slug,
        expires_at: expiryTime,
      })
      .onConflictDoNothing({
        target: tables.sessions.token,
      })
      .returning();

    await setUserSession(
      event,
      {
        id: session.id,
        provider: "github",

        user: {
          slug: user.slug,
          name: user.name,
          email: user.email,
        },
        secure: {
          token: session.token,
          providerData: data,
        },
      },
      {
        maxAge: expirySeconds,
      }
    );

    return sendRedirect(event, "/feed");
  },
});
