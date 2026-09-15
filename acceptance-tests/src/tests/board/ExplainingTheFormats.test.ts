import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * "Casual" and "Scored" mean nothing to a player who has not read the rules, so a (?) beside the
 * format picker unfolds a few plain lines on what sets the two apart. It unfolds in the sheet rather
 * than over it, and it chooses nothing — and it still answers once play has begun and the format can
 * no longer be changed, since that is when a player is most likely to wonder what they are playing.
 */
given("a player opens the settings", () => {
  when("nothing has been asked yet", () => {
    then("the formats are not explained", async ({janggi}) => {
      expect(await janggi.settings.matchFormat.isExplanationShown()).toBe(false);
    });
  });

  when("they ask what the formats are", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.matchFormat.toggleExplanation();
    });

    then("the formats are explained", async ({janggi}) => {
      expect(await janggi.settings.matchFormat.isExplanationShown()).toBe(true);
    });

    then("the format is still casual, asking having chosen nothing", async ({janggi}) => {
      expect(await janggi.settings.matchFormat.getSelected()).toBe("Casual");
    });

    when("they ask again", () => {
      beforeEach(async ({janggi}) => {
        await janggi.settings.matchFormat.toggleExplanation();
      });

      then("the explanation is folded away", async ({janggi}) => {
        expect(await janggi.settings.matchFormat.isExplanationShown()).toBe(false);
      });
    });
  });
});

given("a game is under way", () => {
  beforeEach(async ({janggi}) => {
    await janggi.board.tap(1, 7);
    await janggi.board.tap(1, 6);
  });

  when("the player asks what the formats are", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.matchFormat.toggleExplanation();
    });

    then("the format can no longer be chosen", async ({janggi}) => {
      expect(await janggi.settings.matchFormat.isChoosable()).toBe(false);
    });

    then("the formats are explained all the same", async ({janggi}) => {
      expect(await janggi.settings.matchFormat.isExplanationShown()).toBe(true);
    });
  });
});
