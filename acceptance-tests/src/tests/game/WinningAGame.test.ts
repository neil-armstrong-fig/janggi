import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * Check is the earliest thing a player needs told about that the board cannot show on its own — a
 * general under attack looks like any other piece. It is reachable by real play in three moves, but
 * only because han walks its general off the palace centre; nothing gives check before then.
 *
 * A checkmate is far deeper than anyone can tap out, so what the app does at the end of a game is
 * covered by `GameStatusOf.test.ts` beside the component instead.
 */
given("a game is being played", () => {
  when("nobody is under attack", () => {
    then("no check is shown", async ({janggi}) => {
      expect(await janggi.status.isInCheck()).toBe(false);
    });

    then("nobody has won", async ({janggi}) => {
      expect(await janggi.status.getWinner()).toBeUndefined();
    });
  });

  when("cho puts han's general under attack", () => {
    beforeEach(async ({janggi}) => {
      await janggi.board.tap(1, 10);
      await janggi.board.tap(1, 9);

      await janggi.board.tap(5, 2);
      await janggi.board.tap(4, 2);

      await janggi.board.tap(1, 9);
      await janggi.board.tap(4, 9);
    });

    then("check is shown", async ({janggi}) => {
      expect(await janggi.status.isInCheck()).toBe(true);
    });

    then("it is still han to move, and han has not lost", async ({janggi}) => {
      expect(await janggi.status.getTurn()).toBe("han");
      expect(await janggi.status.getWinner()).toBeUndefined();
    });

    when("han reaches for a piece elsewhere on the board", () => {
      beforeEach(async ({janggi}) => {
        await janggi.board.tap(9, 4);
      });

      then("it is picked up but offered nothing, because it cannot answer the check", async ({janggi}) => {
        expect(await janggi.board.isSelected(9, 4)).toBe(true);
        expect(await janggi.board.canMoveTo(9, 5)).toBe(false);
      });
    });

    when("han steps the general off the file", () => {
      beforeEach(async ({janggi}) => {
        await janggi.board.tap(4, 2);
        await janggi.board.tap(5, 2);
      });

      then("the check is gone", async ({janggi}) => {
        expect(await janggi.status.isInCheck()).toBe(false);
      });
    });
  });
});
