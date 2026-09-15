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

  /**
   * The elephant beside the guards opens with nowhere to go: its own cannon blocks one way out, and its
   * own soldier stands on the far corner of the other. Showing that soldier's point is what explains why.
   */
  when("the pointer rests on a piece hemmed in by its own army", () => {
    beforeEach(async ({janggi}) => {
      await janggi.board.hover(3, 10);
    });

    then(
      "the point it would land on, but for its own soldier standing there, is shown as covered",
      async ({janggi}) => {
        expect(await janggi.board.isShownAsCovered(5, 7)).toBe(true);
      },
    );

    then("that point is not offered as a move", async ({janggi}) => {
      expect(await janggi.board.canMoveTo(5, 7)).toBe(false);
    });

    then("a point it could only reach by passing through a piece is not shown at all", async ({janggi}) => {
      expect(await janggi.board.isShownAsCovered(1, 7)).toBe(false);
    });
  });

  when("a piece hemmed in by its own army is picked up", () => {
    beforeEach(async ({janggi}) => {
      await janggi.board.tap(3, 10);
    });

    then(
      "the point it would land on, but for its own soldier standing there, is shown as covered",
      async ({janggi}) => {
        expect(await janggi.board.isShownAsCovered(5, 7)).toBe(true);
      },
    );
  });

  when("the pointer rests on a piece that can move", () => {
    beforeEach(async ({janggi}) => {
      await janggi.board.hover(1, 7);
    });

    then("a point it may move to is not shown as covered", async ({janggi}) => {
      expect(await janggi.board.isShownAsCovered(1, 6)).toBe(false);
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
