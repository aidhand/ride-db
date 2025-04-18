export default defineOAuthGitHubEventHandler({
  async onSuccess(event, { user, tokens }) {
    await setUserSession(event, {
      provider: "github",

      user: {
        name: user.name,
        email: user.email,
      },
      secure: {
        providerData: user,
        providerTokens: tokens,
      },
    });

    //Create a new session in the database

    // Add the user to the database if needed
    // await useDB()
    //   .insert(tables.users)
    //   .values({ name: user.name })
    //   .onConflictDoNothing();

    return sendRedirect(event, "/feed");
  },
});
