import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * The two points the last move went between stay marked until the next turn is taken. A player
 * looking back at the board after glancing away should not have to work out what the other army just
 * did — and on a phone, where a move is a quick pair of taps, that is most of the time.
 */
given("a game has just begun", () => {
  when("nothing has been played", () => {
    then("no point is marked as moved from or to", async ({janggi}) => {
      expect(await janggi.board.isMarkedAsMovedFrom(1, 7)).toBe(false);
      expect(await janggi.board.isMarkedAsMovedTo(1, 6)).toBe(false);
    });
  });
});

given("cho has advanced a soldier", () => {
  beforeEach(async ({janggi}) => {
    await janggi.board.tap(1, 7);
    await janggi.board.tap(1, 6);
  });

  then("the point the soldier left is marked", async ({janggi}) => {
    expect(await janggi.board.isMarkedAsMovedFrom(1, 7)).toBe(true);
  });

  then("the point the soldier arrived on is marked", async ({janggi}) => {
    expect(await janggi.board.isMarkedAsMovedTo(1, 6)).toBe(true);
  });

  then("a point the move did not touch is not marked", async ({janggi}) => {
    expect(await janggi.board.isMarkedAsMovedFrom(1, 4)).toBe(false);
    expect(await janggi.board.isMarkedAsMovedTo(1, 4)).toBe(false);
  });

  when("han answers with a soldier of its own", () => {
    beforeEach(async ({janggi}) => {
      await janggi.board.tap(1, 4);
      await janggi.board.tap(1, 5);
    });

    then("han's move is the one marked", async ({janggi}) => {
      expect(await janggi.board.isMarkedAsMovedFrom(1, 4)).toBe(true);
      expect(await janggi.board.isMarkedAsMovedTo(1, 5)).toBe(true);
    });

    then("cho's move is no longer marked", async ({janggi}) => {
      expect(await janggi.board.isMarkedAsMovedFrom(1, 7)).toBe(false);
      expect(await janggi.board.isMarkedAsMovedTo(1, 6)).toBe(false);
    });
  });

  when("han rests its turn instead", () => {
    beforeEach(async ({janggi}) => {
      await janggi.status.pass();
    });

    then("cho's move is no longer marked, the last turn having moved nothing", async ({janggi}) => {
      expect(await janggi.board.isMarkedAsMovedFrom(1, 7)).toBe(false);
      expect(await janggi.board.isMarkedAsMovedTo(1, 6)).toBe(false);
    });
  });

  when("the move is taken back", () => {
    beforeEach(async ({janggi}) => {
      await janggi.status.undo();
    });

    then("nothing is marked, there being no move before it", async ({janggi}) => {
      expect(await janggi.board.isMarkedAsMovedFrom(1, 7)).toBe(false);
      expect(await janggi.board.isMarkedAsMovedTo(1, 6)).toBe(false);
    });
  });
});
