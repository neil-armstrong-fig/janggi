import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * The board marks the pieces their owner may move this turn.
 *
 * Most of the time this only says "these are yours" — in the opening nearly a whole army can move.
 * It earns itself when it does not: in check almost everything is frozen, and without the mark the
 * only way to find the two or three pieces that can answer is to reach for each in turn and watch
 * nothing light up. That is the criterion at the bottom of this file, and the reason for the rest.
 */
given("a player is looking at the board", () => {
  when("nothing has been chosen yet", () => {
    then("the pieces that can move are marked, that being the default", async ({janggi}) => {
      expect(await janggi.settings.movableHighlight.getSelected()).toBe("Shown");
    });

    then("cho's pieces are marked, cho being the one to move", async ({janggi}) => {
      expect(await janggi.board.canBeMoved(1, 10)).toBe(true);
      expect(await janggi.board.canBeMoved(1, 7)).toBe(true);
    });

    then("han's are not, whatever han could do on some later turn", async ({janggi}) => {
      expect(await janggi.board.canBeMoved(1, 1)).toBe(false);
      expect(await janggi.board.canBeMoved(1, 4)).toBe(false);
    });

    then("an empty point is not marked, there being nothing on it to move", async ({janggi}) => {
      expect(await janggi.board.canBeMoved(5, 5)).toBe(false);
    });
  });

  when("the highlight is turned off", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.movableHighlight.setTo("Hidden");
    });

    then("nothing is marked any more", async ({janggi}) => {
      expect(await janggi.board.canBeMoved(1, 10)).toBe(false);
      expect(await janggi.board.canBeMoved(1, 7)).toBe(false);
    });

    when("it is turned back on", () => {
      beforeEach(async ({janggi}) => {
        await janggi.settings.movableHighlight.setTo("Shown");
      });

      then("the marks come back", async ({janggi}) => {
        expect(await janggi.settings.movableHighlight.getSelected()).toBe("Shown");
        expect(await janggi.board.canBeMoved(1, 10)).toBe(true);
      });
    });
  });

  /**
   * The line is the one `WinningAGame.test.ts` uses: cho's chariot comes down file 1 and along
   * rank 9 to file 4, where han's general has just stepped into its way.
   */
  when("han's general is under attack", () => {
    beforeEach(async ({janggi}) => {
      await janggi.board.tap(1, 10);
      await janggi.board.tap(1, 9);
      await janggi.board.tap(5, 2);
      await janggi.board.tap(4, 2);
      await janggi.board.tap(1, 9);
      await janggi.board.tap(4, 9);
    });

    then("the general is marked, because it can step off the file", async ({janggi}) => {
      expect(await janggi.board.canBeMoved(4, 2)).toBe(true);
    });

    then("a soldier that cannot answer the check is not marked", async ({janggi}) => {
      expect(await janggi.board.canBeMoved(9, 4)).toBe(false);
    });

    then("cho's pieces are not marked, the turn having passed to han", async ({janggi}) => {
      expect(await janggi.board.canBeMoved(4, 9)).toBe(false);
    });
  });
});
