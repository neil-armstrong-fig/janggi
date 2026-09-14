import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * Closing the app and opening it again. The game on the board and every setting are kept on the
 * device, so the player comes back to exactly what they left — a phone that closed the tab mid-game is
 * the ordinary case, not the exception.
 */
given("a casual game is under way on a board and piece set the player chose", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.board.setTo("Neon");
    await janggi.settings.pieceSet.setTo("Hangul");
    await janggi.board.tap(1, 7);
    await janggi.board.tap(1, 6);
  });

  when("the page is closed and opened again", () => {
    beforeEach(async ({janggi}) => {
      await janggi.reload();
    });

    then("the soldier stands where it was moved to", async ({janggi}) => {
      expect(await janggi.board.getPieceAt(1, 6)).toEqual({side: "cho", type: "soldier"});
      expect(await janggi.board.getPieceAt(1, 7)).toBeUndefined();
    });

    then("it is still han to move", async ({janggi}) => {
      expect(await janggi.status.getTurn()).toBe("han");
    });

    then("the move can still be taken back, the game's record having come back with it", async ({janggi}) => {
      expect(await janggi.status.canUndo()).toBe(true);
    });

    then("the board is still drawn in the style chosen", async ({janggi}) => {
      expect(await janggi.settings.board.getSelected()).toBe("Neon");
    });

    then("the pieces are still drawn in the set chosen", async ({janggi}) => {
      expect(await janggi.settings.pieceSet.getSelected()).toBe("Hangul");
    });
  });
});

given("a scored game in which han has laid out and cho has not", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.matchFormat.setTo("Scored");
    await janggi.settings.hanSetup.setTo("Left Elephant");
  });

  when("the page is closed and opened again", () => {
    beforeEach(async ({janggi}) => {
      await janggi.reload();
    });

    then("the board is still waiting on cho to lay out", async ({janggi}) => {
      expect(await janggi.status.isLayingOut()).toBe(true);
      expect(await janggi.status.getTurn()).toBe("cho");
    });

    then("han's arrangement is still the one it chose", async ({janggi}) => {
      expect(await janggi.settings.hanSetup.getSelected()).toBe("Left Elephant");
    });
  });
});
