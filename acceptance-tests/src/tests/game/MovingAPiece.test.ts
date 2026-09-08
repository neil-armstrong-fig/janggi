import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * Cho opens, so cho's soldier on file 1 is the simplest legal first move on the board: one point
 * forward to (1,6), or sideways to (2,7). See docs/rules.md §5 for the whole opening.
 */
given("a game has just begun", () => {
  when("cho selects one of its soldiers", () => {
    beforeEach(async ({janggi}) => {
      await janggi.board.tap(1, 7);
    });

    then("the point it stands on is shown as selected", async ({janggi}) => {
      expect(await janggi.board.isSelected(1, 7)).toBe(true);
    });

    then("the points it may move to are shown", async ({janggi}) => {
      expect(await janggi.board.canMoveTo(1, 6)).toBe(true);
      expect(await janggi.board.canMoveTo(2, 7)).toBe(true);
    });

    then("a point it may not move to is not shown", async ({janggi}) => {
      expect(await janggi.board.canMoveTo(1, 8)).toBe(false);
      expect(await janggi.board.canMoveTo(5, 5)).toBe(false);
    });
  });

  when("cho selects a soldier and taps where it may go", () => {
    beforeEach(async ({janggi}) => {
      await janggi.board.tap(1, 7);
      await janggi.board.tap(1, 6);
    });

    then("the soldier is standing there", async ({janggi}) => {
      expect(await janggi.board.getPieceAt(1, 6)).toEqual({side: "cho", type: "soldier"});
    });

    then("the point it came from is empty", async ({janggi}) => {
      expect(await janggi.board.getPieceAt(1, 7)).toBeUndefined();
    });

    then("nothing is left selected", async ({janggi}) => {
      expect(await janggi.board.isSelected(1, 6)).toBe(false);
    });
  });

  when("cho taps a piece belonging to han", () => {
    beforeEach(async ({janggi}) => {
      await janggi.board.tap(1, 4);
    });

    then("nothing is selected, because it is not han to move", async ({janggi}) => {
      expect(await janggi.board.isSelected(1, 4)).toBe(false);
    });
  });

  when("cho taps the piece it had already selected", () => {
    beforeEach(async ({janggi}) => {
      await janggi.board.tap(1, 7);
      await janggi.board.tap(1, 7);

      // The pointer is still on the soldier, and merely resting on a piece shows where it may go.
      // Looking away is part of the arrangement: it is what makes the criteria below about the
      // selection rather than about the hover.
      await janggi.board.hover(5, 5);
    });

    then("the piece is no longer selected", async ({janggi}) => {
      expect(await janggi.board.isSelected(1, 7)).toBe(false);
    });

    then("the points it could have moved to are no longer shown", async ({janggi}) => {
      expect(await janggi.board.canMoveTo(1, 6)).toBe(false);
    });
  });
});
