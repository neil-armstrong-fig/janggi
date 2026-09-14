import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * The end of a game lands: the board takes a blow as the result is announced, and settles. Two rested
 * turns in a row is the shortest way to end one by tapping. Run only by the `*-effects` projects.
 */
given("motion is left on", () => {
  when("both players rest a turn, one after the other", () => {
    beforeEach(async ({janggi}) => {
      await janggi.status.pass();
      await janggi.status.pass();
    });

    then("the board is shaken as the game ends", async ({janggi}) => {
      expect(await janggi.board.isBeingShaken()).toBe(true);
    });

    then("the board comes back to rest", async ({janggi}) => {
      expect(await janggi.board.isAtRest()).toBe(true);
    });

    then("the result is announced over the board", async ({janggi}) => {
      expect(await janggi.status.isResultAnnounced()).toBe(true);
    });
  });
});
