import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * Accounts are behind a flag in the address for now — `?account` — so that what is deployed can be tried before it is
 * shown to anyone. Without it the game is exactly what it was: nothing about accounts in the settings, and nothing
 * sent to the API.
 */
given("a player who has not been told about accounts", () => {
  when("they look through the settings", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.openTheSettings();
    });

    then("there is no account section", async ({janggi}) => {
      expect(await janggi.settings.account.isAccountOffered()).toBe(false);
    });

    then("signing in is not offered anywhere", async ({janggi}) => {
      expect(await janggi.settings.account.isSignInOfferedOutsideTheSettings()).toBe(false);
    });

    then("the game has made no call to the API", async ({janggi}) => {
      expect(await janggi.settings.account.getRequestsMadeToTheApi()).toBe(0);
    });
  });
});
