import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * The announcement of a result covers the middle of the board, which is where a player wants to look once the game is
 * over. Show board puts it aside, and a note over the board says that tapping the board brings it back, since nothing
 * else on the board would say so.
 */
given("a game that has ended", () => {
  beforeEach(async ({janggi}) => {
    await janggi.status.controls.pass();
    await janggi.status.controls.pass();
  });

  then("the result is announced, and the board is not being looked at", async ({janggi}) => {
    expect(await janggi.status.overlay.resultBanner.isResultAnnounced()).toBe(true);
    expect(await janggi.status.overlay.boardPeek.isBoardShown()).toBe(false);
  });

  when("the player chooses to show the board", () => {
    beforeEach(async ({janggi}) => {
      await janggi.status.overlay.resultBanner.showBoard();
    });

    then("the result is put aside and the board is shown", async ({janggi}) => {
      expect(await janggi.status.overlay.resultBanner.isResultAnnounced()).toBe(false);
      expect(await janggi.status.overlay.boardPeek.isBoardShown()).toBe(true);
    });

    when("they tap the board", () => {
      beforeEach(async ({janggi}) => {
        await janggi.status.overlay.boardPeek.tapTheBoardToSeeTheResult();
      });

      then("the result is announced again", async ({janggi}) => {
        expect(await janggi.status.overlay.resultBanner.isResultAnnounced()).toBe(true);
        expect(await janggi.status.overlay.boardPeek.isBoardShown()).toBe(false);
      });
    });

    when("the last turn is taken back", () => {
      beforeEach(async ({janggi}) => {
        await janggi.status.controls.undo();
      });

      then("the board is no longer put aside for a result", async ({janggi}) => {
        expect(await janggi.status.overlay.boardPeek.isBoardShown()).toBe(false);
      });
    });
  });
});
