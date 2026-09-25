import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * Two people playing on one phone or tablet sit across from each other, so Han's player sees the
 * pieces upside down. With the flip on, the pieces turn to face Han's player by themselves for Han's
 * move and back for Cho's, so nobody goes into the settings between turns. The board stays where it
 * is, so each army stays on its own player's side. It is only for playing a person: against
 * the bot there is no one across the table, which `BoardFlippedForHan.test.ts` covers.
 */
given("a player playing another person", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.opponent.setTo("Human");
  });

  when("the board is not set to flip for Han", () => {
    then("it is off by default", async ({janggi}) => {
      expect(await janggi.settings.flipBoard.isOn()).toBe(false);
    });

    when("Cho has moved", () => {
      beforeEach(async ({janggi}) => {
        await janggi.board.tap(5, 7);
        await janggi.board.tap(4, 7);
      });

      then("the pieces are still the right way up for Cho", async ({janggi}) => {
        expect(await janggi.board.isFlippedForHan()).toBe(false);
      });
    });
  });

  when("they set the board to flip for Han", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.flipBoard.setTo(true);
    });

    then("the pieces face Cho for Cho's first move", async ({janggi}) => {
      expect(await janggi.board.isFlippedForHan()).toBe(false);
    });

    when("Cho has moved", () => {
      beforeEach(async ({janggi}) => {
        await janggi.board.tap(5, 7);
        await janggi.board.tap(4, 7);
      });

      then("the pieces are turned to face Han", async ({janggi}) => {
        expect(await janggi.board.isFlippedForHan()).toBe(true);
      });

      then("the controls are along the top, within Han's reach", async ({janggi}) => {
        expect(await janggi.status.areControlsAboveTheBoard()).toBe(true);
      });

      then("the controls are turned to face Han", async ({janggi}) => {
        expect(await janggi.status.areControlsUpsideDown()).toBe(true);
      });

      when("Han has moved", () => {
        beforeEach(async ({janggi}) => {
          await janggi.board.tap(5, 4);
          await janggi.board.tap(4, 4);
        });

        then("the pieces turn back to face Cho", async ({janggi}) => {
          expect(await janggi.board.isFlippedForHan()).toBe(false);
        });

        then("the controls drop back below the board", async ({janggi}) => {
          expect(await janggi.status.areControlsAboveTheBoard()).toBe(false);
          expect(await janggi.status.areControlsUpsideDown()).toBe(false);
        });
      });
    });
  });
});
