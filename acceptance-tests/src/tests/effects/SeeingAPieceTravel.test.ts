import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * Run only by the `*-effects` projects, with motion left on. Every other spec runs with motion reduced
 * and never sees any of this.
 *
 * Most of what is asserted here is where the motion **leaves** the board once it has settled, because
 * that is what a player is left looking at and what a broken animation gets wrong: a piece left
 * invisible after its flight, a copy of it left hanging over the board, a board shaken and never set
 * back. Each query waits for every animation on the page to finish before it answers, so none of
 * them race the motion they are about.
 *
 * The one criterion that looks at the motion itself — that a piece is shown travelling at all — waits
 * for the flight to appear, and a flight lasts far longer than a tap takes to return.
 */
given("motion is left on", () => {
  when("cho advances a soldier", () => {
    beforeEach(async ({janggi}) => {
      await janggi.board.tap(1, 7);
      await janggi.board.tap(1, 6);
    });

    then("the soldier is shown travelling between the two points", async ({janggi}) => {
      expect(await janggi.board.isShowingAPieceInFlight()).toBe(true);
    });

    then("the soldier is fully shown on the point it moved to once it has arrived", async ({janggi}) => {
      expect(await janggi.board.isPieceFullyShownAt(1, 6)).toBe(true);
    });

    then("nothing is left drawn over the board once it has arrived", async ({janggi}) => {
      expect(await janggi.board.isClearOfMotion()).toBe(true);
    });
  });

  when("han takes a soldier", () => {
    beforeEach(async ({janggi}) => {
      await janggi.board.tap(1, 7);
      await janggi.board.tap(1, 6);
      await janggi.board.tap(1, 4);
      await janggi.board.tap(1, 5);
      await janggi.board.tap(3, 7);
      await janggi.board.tap(3, 6);
      await janggi.board.tap(1, 5);
      await janggi.board.tap(1, 6);
    });

    then("the capture is shown landing", async ({janggi}) => {
      expect(await janggi.board.isShowingAnImpact()).toBe(true);
    });

    then("the board is shaken by it", async ({janggi}) => {
      expect(await janggi.board.isBeingShaken()).toBe(true);
    });

    then("the taking soldier is fully shown on the point it took", async ({janggi}) => {
      expect(await janggi.board.isPieceFullyShownAt(1, 6)).toBe(true);
    });

    then("nothing is left drawn over the board once the capture has landed", async ({janggi}) => {
      expect(await janggi.board.isClearOfMotion()).toBe(true);
    });

    then("the board comes back to rest after being shaken", async ({janggi}) => {
      expect(await janggi.board.isAtRest()).toBe(true);
    });

    when("the capture is taken back", () => {
      beforeEach(async ({janggi}) => {
        await janggi.status.undo();
      });

      then("both soldiers are fully shown where they stood before it", async ({janggi}) => {
        expect(await janggi.board.isPieceFullyShownAt(1, 5)).toBe(true);
        expect(await janggi.board.isPieceFullyShownAt(1, 6)).toBe(true);
      });

      then("nothing is left drawn over the board", async ({janggi}) => {
        expect(await janggi.board.isClearOfMotion()).toBe(true);
      });
    });
  });
});
