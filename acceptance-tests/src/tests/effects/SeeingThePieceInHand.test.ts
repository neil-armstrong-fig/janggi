import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * A piece in hand is lifted off the board, the way it would be between finger and thumb, and put back
 * down when it is let go or played. Run only by the `*-effects` projects, with motion left on; every
 * query waits for the lift to finish rising or settling before it answers.
 */
given("motion is left on", () => {
  when("cho picks up a soldier", () => {
    beforeEach(async ({janggi}) => {
      await janggi.board.tap(1, 7);
    });

    then("the soldier is drawn raised off the board", async ({janggi}) => {
      expect(await janggi.board.isPieceRaisedAt(1, 7)).toBe(true);
    });

    then("no other piece is raised", async ({janggi}) => {
      expect(await janggi.board.isPieceRaisedAt(3, 7)).toBe(false);
    });

    when("cho puts it back down", () => {
      beforeEach(async ({janggi}) => {
        await janggi.board.tap(1, 7);
      });

      then("the soldier settles back onto the board", async ({janggi}) => {
        expect(await janggi.board.isPieceRaisedAt(1, 7)).toBe(false);
      });
    });

    when("cho plays it", () => {
      beforeEach(async ({janggi}) => {
        await janggi.board.tap(1, 6);
      });

      then("the soldier is set down where it lands, not left raised", async ({janggi}) => {
        expect(await janggi.board.isPieceRaisedAt(1, 6)).toBe(false);
      });
    });
  });
});
