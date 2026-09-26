import {expect, given, then, useFreshPlayer, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * A first visit lands on a live board, and nothing says what Janggi is. This is the welcome that does.
 * Every other spec starts as a returning player — the fixture keeps them from it — so the welcome is
 * asked for here and nowhere else.
 */
given("a player opening the game for the first time", () => {
  useFreshPlayer();

  when("the game has loaded", () => {
    then("they are welcomed", async ({janggi}) => {
      expect(await janggi.onboarding.isWelcomeShown()).toBe(true);
    });

    then("they are told what Janggi is", async ({janggi}) => {
      const welcome = await janggi.onboarding.getWelcomeText();

      expect(welcome).toContain("Korean chess");
      expect(welcome).toContain("general");
    });
  });
});

given("a player who has played before", () => {
  when("the game has loaded", () => {
    then("they are not welcomed", async ({janggi}) => {
      expect(await janggi.onboarding.isWelcomeShown()).toBe(false);
    });
  });
});
