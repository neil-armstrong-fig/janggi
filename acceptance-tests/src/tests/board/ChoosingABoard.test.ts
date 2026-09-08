import {expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * A board style paints the intersections and nothing else. The two that ship look nothing alike —
 * one is wood and ink, the other is deliberately unlike a real board — so this is where it shows
 * whether painting the grid can reach the game standing on it.
 */
given("a user is choosing a board", () => {
  when("a different board is chosen", () => {
    then("it is the one now in use", async ({janggi}) => {
      await janggi.settings.setBoardTo("Neon");

      expect(await janggi.settings.selectedBoard()).toBe("Neon");
    });

    then("every piece is left standing where it was", async ({janggi}) => {
      await janggi.settings.setBoardTo("Neon");

      expect(await janggi.board.countPieces()).toBe(32);
      expect(await janggi.board.pieceAt(5, 9)).toEqual({side: "cho", type: "general"});
      expect(await janggi.board.pieceAt(1, 10)).toEqual({side: "cho", type: "chariot"});
    });

    then("the pieces are still wearing the set that was chosen", async ({janggi}) => {
      await janggi.settings.setPieceSetTo("Hangul");
      await janggi.settings.setBoardTo("Neon");

      expect(await janggi.board.characterAt(5, 9)).toBe("초");
    });
  });

  when("the board is changed back", () => {
    then("the original is in use again", async ({janggi}) => {
      await janggi.settings.setBoardTo("Neon");
      await janggi.settings.setBoardTo("Classic");

      expect(await janggi.settings.selectedBoard()).toBe("Classic");
      expect(await janggi.board.countPieces()).toBe(32);
    });
  });
});
