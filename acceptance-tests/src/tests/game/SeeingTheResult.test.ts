import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * The end of a game is announced over the board rather than only in the herald's one line, because it
 * is the one moment every player at the table needs to take in at once. Two rested turns in a row is
 * the shortest way a game can be ended by tapping, and settles it on points.
 *
 * The announcement offers a new game there and then, because the end of a game is exactly when a
 * player reaches for one — and New game in the settings sheet is a long way to go looking for it.
 */
given("a game is being played", () => {
  when("nothing has decided it", () => {
    then("no result is announced", async ({janggi}) => {
      expect(await janggi.status.isResultAnnounced()).toBe(false);
    });
  });

  when("both players rest a turn, one after the other", () => {
    beforeEach(async ({janggi}) => {
      await janggi.status.pass();
      await janggi.status.pass();
    });

    then("the result is announced over the board", async ({janggi}) => {
      expect(await janggi.status.isResultAnnounced()).toBe(true);
    });

    when("the second rested turn is taken back", () => {
      beforeEach(async ({janggi}) => {
        await janggi.status.undo();
      });

      then("the announcement is withdrawn, the game going on", async ({janggi}) => {
        expect(await janggi.status.isResultAnnounced()).toBe(false);
      });
    });

    when("a new game is started from the announcement", () => {
      beforeEach(async ({janggi}) => {
        await janggi.status.startNewGame();
      });

      then("the announcement is gone", async ({janggi}) => {
        expect(await janggi.status.isResultAnnounced()).toBe(false);
      });

      then("a fresh game is dealt, with cho to move and nothing to take back", async ({janggi}) => {
        expect(await janggi.status.getTurn()).toBe("cho");
        expect(await janggi.status.getWinner()).toBeUndefined();
        expect(await janggi.status.canUndo()).toBe(false);
      });
    });
  });
});
