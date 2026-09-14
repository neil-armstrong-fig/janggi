import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * The game starts with its effects in full, and a player may turn them down. Run only by the
 * `*-effects` projects, which leave the effects as the game starts them.
 */
given("motion is left on", () => {
  when("the page has loaded", () => {
    then("effects start in full", async ({janggi}) => {
      expect(await janggi.settings.effects.getSelected()).toBe("Full");
    });
  });

  when("effects are reduced", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.effects.setTo("Reduced");
    });

    when("cho advances a soldier", () => {
      beforeEach(async ({janggi}) => {
        await janggi.board.tap(1, 7);
        await janggi.board.tap(1, 6);
      });

      then("the soldier is not shown travelling", async ({janggi}) => {
        expect(await janggi.board.isShowingAPieceInFlight()).toBe(false);
      });

      then("the soldier is fully shown where it arrived", async ({janggi}) => {
        expect(await janggi.board.isPieceFullyShownAt(1, 6)).toBe(true);
      });

      then("the point it arrived on is still marked, the mark carrying no motion", async ({janggi}) => {
        expect(await janggi.board.isMarkedAsMovedTo(1, 6)).toBe(true);
      });
    });
  });
});
