import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * The settings are a sheet over the lower part of the screen, and most of what it changes is on the
 * board behind it. So a choice is seen being made: the sheet stays where it is while a setup is
 * picked, the board lays itself out again at once underneath, and the sheet leaves the far end of the
 * board — Han's back rank — uncovered.
 */
given("a player has the settings open", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.openTheSettings();
  });

  when("they arrange cho's army with the outer elephants", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.choSetup.setTo("Outer Elephant");
    });

    then("the settings are still open", async ({janggi}) => {
      expect(await janggi.settings.isOpen()).toBe(true);
    });

    then("the board behind them has laid cho's pieces out again", async ({janggi}) => {
      expect(await janggi.board.getPieceAt(3, 10)).toEqual({side: "cho", type: "horse"});
      expect(await janggi.board.getPieceAt(2, 10)).toEqual({side: "cho", type: "elephant"});
    });
  });

  when("nothing has been chosen yet", () => {
    then("han's back rank is in sight above them", async ({janggi}) => {
      expect(await janggi.settings.isCoveringTheBoardAt(5, 1)).toBe(false);
    });
  });
});
