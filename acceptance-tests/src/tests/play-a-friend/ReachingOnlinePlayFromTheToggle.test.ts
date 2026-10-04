import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * Online is always one of the two games in the Play tab, and where there is no game with a friend yet it leads to what
 * is missing: the sign-in for someone signed out, the sheet that makes or takes a code for someone signed in.
 */
given("a player with no game with a friend", () => {
  then("the board shows their own game", async ({janggi}) => {
    expect(await janggi.settings.games.getShown()).toBe("local");
  });

  when("they are signed out and choose Online", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.games.chooseOnline();
    });

    then("the settings open on the account card, picked out", async ({janggi}) => {
      expect(await janggi.settings.isTabSelected("You")).toBe(true);
      expect(await janggi.settings.account.isSignInOffered()).toBe(true);
      expect(await janggi.settings.account.isAccountHighlighted()).toBe(true);
    });

    then("a toast says why they were sent there", async ({janggi}) => {
      expect(await janggi.toast.getWords()).toBe("Sign in to play a friend online.");
    });

    then("the toast goes by itself", async ({janggi}) => {
      await expect.poll(() => janggi.toast.getWords(), {timeout: 8_000}).toBeUndefined();
    });

    then("the game has made no call to the API", async ({janggi}) => {
      expect(await janggi.settings.account.getRequestsMadeToTheApi()).toBe(0);
    });
  });

  when("they are signed in and choose Online", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.account.signInWithGoogle();
      await janggi.settings.games.chooseOnline();
    });

    then("the sheet to make or take a code is open", async ({janggi}) => {
      expect(await janggi.playAFriend.isTheSheetOpen()).toBe(true);
    });
  });
});
