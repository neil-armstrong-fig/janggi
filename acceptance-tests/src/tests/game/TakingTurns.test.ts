import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * Cho opens and han answers. Forward is `rank - 1` for cho and `rank + 1` for han — the two armies
 * advance towards each other from ranks 7 and 4 — so cho's soldier on (1,7) and han's on (1,4) meet
 * on file 1. See docs/rules.md §1.
 */
given("cho has played the opening move", () => {
  beforeEach(async ({janggi}) => {
    await janggi.board.tap(1, 7);
    await janggi.board.tap(1, 6);
  });

  when("han selects one of its own pieces", () => {
    beforeEach(async ({janggi}) => {
      await janggi.board.tap(1, 4);
    });

    then("it is picked up", async ({janggi}) => {
      expect(await janggi.board.isSelected(1, 4)).toBe(true);
    });

    then("the points it may move to are shown", async ({janggi}) => {
      expect(await janggi.board.canMoveTo(1, 5)).toBe(true);
      expect(await janggi.board.canMoveTo(2, 4)).toBe(true);
    });
  });

  when("cho tries to move again", () => {
    beforeEach(async ({janggi}) => {
      await janggi.board.tap(3, 7);
    });

    then("nothing is picked up, because the turn has passed", async ({janggi}) => {
      expect(await janggi.board.isSelected(3, 7)).toBe(false);
    });
  });

  when("han plays its reply", () => {
    beforeEach(async ({janggi}) => {
      await janggi.board.tap(1, 4);
      await janggi.board.tap(1, 5);
    });

    then("han's soldier is standing on its new point", async ({janggi}) => {
      expect(await janggi.board.getPieceAt(1, 5)).toEqual({side: "han", type: "soldier"});
      expect(await janggi.board.getPieceAt(1, 4)).toBeUndefined();
    });

    then("both armies are still on the board in full", async ({janggi}) => {
      expect(await janggi.board.getPieceCount()).toBe(32);
    });

    when("cho then reaches for a piece of its own", () => {
      beforeEach(async ({janggi}) => {
        await janggi.board.tap(3, 7);
      });

      then("it is picked up, because the turn has come back", async ({janggi}) => {
        expect(await janggi.board.isSelected(3, 7)).toBe(true);
      });
    });
  });
});

/**
 * Every capture the suite covers so far is cho's. This is han taking, which needs three moves to
 * set up: the two soldiers advance into contact, then cho plays elsewhere to hand the turn back.
 */
given("the two soldiers on file 1 have advanced into contact", () => {
  beforeEach(async ({janggi}) => {
    await janggi.board.tap(1, 7);
    await janggi.board.tap(1, 6);
    await janggi.board.tap(1, 4);
    await janggi.board.tap(1, 5);
    await janggi.board.tap(3, 7);
    await janggi.board.tap(3, 6);
  });

  when("neither has taken the other yet", () => {
    then("they are facing each other a point apart", async ({janggi}) => {
      expect(await janggi.board.getPieceAt(1, 6)).toEqual({side: "cho", type: "soldier"});
      expect(await janggi.board.getPieceAt(1, 5)).toEqual({side: "han", type: "soldier"});
    });
  });

  when("han takes cho's soldier", () => {
    beforeEach(async ({janggi}) => {
      await janggi.board.tap(1, 5);
      await janggi.board.tap(1, 6);
    });

    then("han's soldier is standing where cho's was", async ({janggi}) => {
      expect(await janggi.board.getPieceAt(1, 6)).toEqual({side: "han", type: "soldier"});
    });

    then("a piece has left the board", async ({janggi}) => {
      expect(await janggi.board.getPieceCount()).toBe(31);
    });
  });
});

/**
 * Whose turn it is has to be on screen. Without it a board that is simply waiting for the other
 * army is indistinguishable from one that has stopped responding — tapping your own pieces does
 * nothing, and nothing says why.
 */
given("a game is being played", () => {
  when("nobody has moved yet", () => {
    then("it is cho to move, because cho opens", async ({janggi}) => {
      expect(await janggi.status.getTurn()).toBe("cho");
    });
  });

  when("cho has moved", () => {
    beforeEach(async ({janggi}) => {
      await janggi.board.tap(1, 7);
      await janggi.board.tap(1, 6);
    });

    then("it is han to move", async ({janggi}) => {
      expect(await janggi.status.getTurn()).toBe("han");
    });
  });

  when("both armies have moved", () => {
    beforeEach(async ({janggi}) => {
      await janggi.board.tap(1, 7);
      await janggi.board.tap(1, 6);
      await janggi.board.tap(1, 4);
      await janggi.board.tap(1, 5);
    });

    then("it is cho to move again", async ({janggi}) => {
      expect(await janggi.status.getTurn()).toBe("cho");
    });
  });
});
