import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * A new game is set out rank by rank rather than appearing whole. What is asserted is where that
 * leaves the board: every piece set out and fully shown — including one on a rank set out late, and
 * one that was elsewhere a moment ago. Run only by the `*-effects` projects.
 */
given("motion is left on", () => {
  when("a new game is dealt after a move has been played", () => {
    beforeEach(async ({janggi}) => {
      await janggi.board.tap(1, 7);
      await janggi.board.tap(1, 6);
      await janggi.settings.startNewGame();
    });

    then("the back ranks are fully shown once they have been set out", async ({janggi}) => {
      expect(await janggi.board.isPieceFullyShownAt(1, 10)).toBe(true);
      expect(await janggi.board.isPieceFullyShownAt(5, 2)).toBe(true);
    });

    then("the soldiers by the river are fully shown once they have been set out too", async ({janggi}) => {
      expect(await janggi.board.isPieceFullyShownAt(9, 4)).toBe(true);
      expect(await janggi.board.isPieceFullyShownAt(9, 7)).toBe(true);
    });

    then("the soldier that had moved is fully shown back where it began", async ({janggi}) => {
      expect(await janggi.board.isPieceFullyShownAt(1, 7)).toBe(true);
    });
  });
});
