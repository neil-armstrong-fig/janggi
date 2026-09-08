import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * Resting the pointer on a piece shows where it could go, so the board teaches the rules to someone
 * who does not know them without committing them to a move. There is no pointer on a touch screen,
 * where tapping does the same job.
 */
given("a game has just begun", () => {
  when("the pointer rests on a piece without tapping it", () => {
    beforeEach(async ({janggi}) => {
      await janggi.board.hover(1, 7);
    });

    then("the points it could move to are shown", async ({janggi}) => {
      expect(await janggi.board.canMoveTo(1, 6)).toBe(true);
      expect(await janggi.board.canMoveTo(2, 7)).toBe(true);
    });

    then("the piece is not picked up by looking at it", async ({janggi}) => {
      expect(await janggi.board.isSelected(1, 7)).toBe(false);
    });
  });

  when("the pointer rests on a piece of the army whose turn it is not", () => {
    beforeEach(async ({janggi}) => {
      await janggi.board.hover(1, 4);
    });

    /** `movesFrom` answers for either army, so the board explains han's pieces on cho's turn too. */
    then("it answers for that army too", async ({janggi}) => {
      expect(await janggi.board.canMoveTo(1, 5)).toBe(true);
    });
  });

  when("the pointer moves off onto an empty point", () => {
    beforeEach(async ({janggi}) => {
      await janggi.board.hover(1, 7);
      await janggi.board.hover(5, 5);
    });

    then("nothing is shown any more", async ({janggi}) => {
      expect(await janggi.board.canMoveTo(1, 6)).toBe(false);
    });
  });

  when("a piece is in hand and the pointer wanders onto another", () => {
    beforeEach(async ({janggi}) => {
      await janggi.board.tap(1, 7);
      await janggi.board.hover(3, 7);
    });

    then("the piece in hand keeps the board, so a move cannot change under the player", async ({janggi}) => {
      expect(await janggi.board.canMoveTo(1, 6)).toBe(true);
      expect(await janggi.board.canMoveTo(4, 7)).toBe(false);
    });
  });
});
