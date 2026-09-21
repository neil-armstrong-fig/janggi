import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * How strong the bot plays and which army the player takes are questions about the bot, so they are
 * only put to a player who is playing it. Against another person there is nothing for them to
 * answer, and a sheet that opens crowded is harder to use one-handed than one that leaves them out.
 */
given("a player is choosing who to play", () => {
  when("they play the bot", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.opponent.setTo("Bot");
    });

    then("they are asked how strong it is and which army they take", async ({janggi}) => {
      expect(await janggi.settings.botStrength.isShown()).toBe(true);
      expect(await janggi.settings.yourSide.isShown()).toBe(true);
    });
  });

  when("they play another person", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.opponent.setTo("Human");
    });

    then("they are not asked either", async ({janggi}) => {
      expect(await janggi.settings.botStrength.isShown()).toBe(false);
      expect(await janggi.settings.yourSide.isShown()).toBe(false);
    });
  });
});
