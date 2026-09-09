import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * A board style paints the intersections and nothing else. The two that ship look nothing alike —
 * one is wood and ink, the other is deliberately unlike a real board — so this is where it shows
 * whether painting the grid can reach the game standing on it.
 */
given("a user is choosing a board", () => {
  when("a different board is chosen", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.board.setTo("Neon");
    });

    then("it is the one now in use", async ({janggi}) => {
      expect(await janggi.settings.board.getSelected()).toBe("Neon");
    });

    then("every piece is left standing where it was", async ({janggi}) => {
      expect(await janggi.board.getPieceCount()).toBe(32);
      expect(await janggi.board.getPieceAt(5, 9)).toEqual({side: "cho", type: "general"});
      expect(await janggi.board.getPieceAt(1, 10)).toEqual({side: "cho", type: "chariot"});
    });
  });

  /** Its own `when` because the order is the point: the set is chosen first, so the board changing
   * afterwards is what the criterion is about. */
  when("the board is changed after a piece set was chosen", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.pieceSet.setTo("Hangul");
      await janggi.settings.board.setTo("Neon");
    });

    then("the pieces are still wearing the set that was chosen", async ({janggi}) => {
      expect(await janggi.board.getCharacterAt(5, 9)).toBe("초");
    });
  });

  when("the board is changed back", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.board.setTo("Neon");
      await janggi.settings.board.setTo("Classic");
    });

    then("the original is in use again", async ({janggi}) => {
      expect(await janggi.settings.board.getSelected()).toBe("Classic");
      expect(await janggi.board.getPieceCount()).toBe(32);
    });
  });
});
