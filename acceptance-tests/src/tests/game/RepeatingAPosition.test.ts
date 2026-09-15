import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * "동일한 수를 3회 이상 반복할 수 없다" — a position may not stand a third time, unless each side is
 * under thirty points. Two whole armies are seventy-two each, so from the opening the rule bites.
 * See `docs/rules.md` §6.4.
 *
 * Nothing on the board itself shows it: the move that would repeat is simply not offered, the way a
 * move that would leave a general in check is not. To a player who knows chess, where a third
 * repetition draws, a barred move looks exactly like a move that was never legal — so while one is
 * being held back, a note over the board says why. This spec shows the rule reaches the board, and
 * that the note comes and goes with it.
 *
 * Each general steps off its palace centre and back onto it, which is the shortest circuit that
 * changes nothing — four plies bring the opening position round a second time, and the eighth would
 * be its third standing.
 */
given("both generals have shuffled off their palace centres and back, twice", () => {
  beforeEach(async ({janggi}) => {
    await janggi.board.tap(5, 9);
    await janggi.board.tap(5, 10);
    await janggi.board.tap(5, 2);
    await janggi.board.tap(5, 1);
    await janggi.board.tap(5, 10);
    await janggi.board.tap(5, 9);
    await janggi.board.tap(5, 1);
    await janggi.board.tap(5, 2);

    await janggi.board.tap(5, 9);
    await janggi.board.tap(5, 10);
    await janggi.board.tap(5, 2);
    await janggi.board.tap(5, 1);
    await janggi.board.tap(5, 10);
    await janggi.board.tap(5, 9);
  });

  when("han's general is reached for, one step from standing there a third time", () => {
    beforeEach(async ({janggi}) => {
      await janggi.board.tap(5, 1);
    });

    then("the step back onto its palace centre is not offered", async ({janggi}) => {
      expect(await janggi.board.canMoveTo(5, 2)).toBe(false);
    });

    then("it is offered nowhere else either, its guards holding the two points beside it", async ({janggi}) => {
      expect(await janggi.board.canMoveTo(4, 1)).toBe(false);
      expect(await janggi.board.canMoveTo(6, 1)).toBe(false);
    });

    then("a note over the board explains that the repeat is held back", async ({janggi}) => {
      expect(await janggi.status.isRepetitionExplained()).toBe(true);
    });
  });

  when("han plays something else instead", () => {
    beforeEach(async ({janggi}) => {
      await janggi.board.tap(1, 4);
      await janggi.board.tap(1, 5);
    });

    then("the game carries on, one barred move being no ending", async ({janggi}) => {
      expect(await janggi.status.getTurn()).toBe("cho");
      expect(await janggi.status.getWinner()).toBeUndefined();
      expect(await janggi.status.isDrawn()).toBe(false);
    });

    then("the note is gone, nothing being held back any more", async ({janggi}) => {
      expect(await janggi.status.isRepetitionExplained()).toBe(false);
    });
  });
});
