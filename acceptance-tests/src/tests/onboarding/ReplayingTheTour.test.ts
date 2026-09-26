import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * A player who skipped the tour, or has forgotten it, can have it again from their progress. The welcome is
 * not repeated — it asked for choices they have made — only the tour is. A player who has been through it
 * is a returning one, which is what every spec starts as, so nothing here asks for a first visit.
 */
given("a player who has already been through the tour", () => {
  when("they replay it from their progress", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.progress.replayTheTour();
    });

    then("the tour starts again from its first step", async ({janggi}) => {
      expect(await janggi.onboarding.isTourShown()).toBe(true);
      expect(await janggi.onboarding.getTourStep()).toBe(1);
    });

    then("the welcome is not shown again", async ({janggi}) => {
      expect(await janggi.onboarding.isWelcomeShown()).toBe(false);
    });

    then("the settings are put away, for the board is what it starts on", async ({janggi}) => {
      expect(await janggi.settings.isOpen()).toBe(false);
    });

    when("they skip it", () => {
      beforeEach(async ({janggi}) => {
        await janggi.onboarding.skipTheTour();
      });

      then("it is gone again", async ({janggi}) => {
        expect(await janggi.onboarding.isTourShown()).toBe(false);
      });
    });
  });
});
