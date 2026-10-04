import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * Signing in is something a player goes looking for, never something the game asks for. Someone who never does
 * has the game exactly as it was: nothing offered over it, and nothing sent anywhere.
 */
given("a player who never signs in", () => {
  when("they play without opening the settings", () => {
    beforeEach(async ({janggi}) => {
      await janggi.board.tap(1, 7);
    });

    then("signing in is not offered anywhere over the game", async ({janggi}) => {
      expect(await janggi.settings.account.isSignInOfferedOutsideTheSettings()).toBe(false);
    });

    then("playing a friend is not offered anywhere over the game", async ({janggi}) => {
      expect(await janggi.playAFriend.isOfferedOutsideTheSettings()).toBe(false);
    });

    then("the game has made no call to the API", async ({janggi}) => {
      expect(await janggi.settings.account.getRequestsMadeToTheApi()).toBe(0);
    });
  });

  when("they look through the settings", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.openTheSettings();
    });

    then("signing in is offered there", async ({janggi}) => {
      expect(await janggi.settings.account.isSignInOffered()).toBe(true);
    });

    then("the game has still made no call to the API", async ({janggi}) => {
      expect(await janggi.settings.account.getRequestsMadeToTheApi()).toBe(0);
    });
  });
});
