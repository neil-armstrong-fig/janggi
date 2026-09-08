import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * A game can now end, so there has to be a way to begin another one. And because a back rank is
 * arranged strictly before play — `docs/rules.md` §6.6 — choosing an arrangement is not something
 * that can be done to a game already under way.
 */
given("a game is under way", () => {
  beforeEach(async ({janggi}) => {
    await janggi.board.tap(1, 7);
    await janggi.board.tap(1, 6);
  });

  then("the setups can no longer be chosen", async ({janggi}) => {
    expect(await janggi.settings.canChooseSetups()).toBe(false);
  });

  when("a new game is started", () => {
    beforeEach(async ({janggi}) => {
      await janggi.status.startNewGame();
    });

    then("the pieces are back where they began", async ({janggi}) => {
      expect(await janggi.board.getPieceCount()).toBe(32);
      expect(await janggi.board.getPieceAt(1, 7)).toEqual({side: "cho", type: "soldier"});
      expect(await janggi.board.getPieceAt(1, 6)).toBeUndefined();
    });

    then("it is cho to move, because cho opens", async ({janggi}) => {
      expect(await janggi.status.getTurn()).toBe("cho");
    });

    then("the setups can be chosen again", async ({janggi}) => {
      expect(await janggi.settings.canChooseSetups()).toBe(true);
    });
  });
});

given("no move has been played yet", () => {
  then("the setups can be chosen", async ({janggi}) => {
    expect(await janggi.settings.canChooseSetups()).toBe(true);
  });

  when("an arrangement is chosen", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.setBothSetupsTo("Outer Elephant");
    });

    then("the board is dealt again from it", async ({janggi}) => {
      expect(await janggi.board.getPieceAt(2, 10)).toEqual({side: "cho", type: "elephant"});
      expect(await janggi.status.getTurn()).toBe("cho");
    });
  });
});
