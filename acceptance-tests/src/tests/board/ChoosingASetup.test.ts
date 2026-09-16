import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * Janggi has no fixed opening position. Each player arranges their own back rank before the first
 * move and the two choices are independent, so both armies get a control of their own.
 *
 * Cho's back rank is rank 10 and Han's is rank 1. Files run 1 to 9 across the board for both.
 */
given("a user is choosing how to arrange the pieces", () => {
  when("the inner elephant setup is chosen", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.setBothSetupsTo("Inner Elephant");
    });

    then("each elephant stands beside a guard", async ({janggi}) => {
      expect(await janggi.board.getPieceAt(3, 10)).toEqual({side: "cho", type: "elephant"});
      expect(await janggi.board.getPieceAt(2, 10)).toEqual({side: "cho", type: "horse"});
    });
  });

  when("the outer elephant setup is chosen", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.setBothSetupsTo("Outer Elephant");
    });

    then("each flank's pair has swapped over", async ({janggi}) => {
      expect(await janggi.board.getPieceAt(3, 10)).toEqual({side: "cho", type: "horse"});
      expect(await janggi.board.getPieceAt(2, 10)).toEqual({side: "cho", type: "elephant"});
    });
  });

  when("the chosen setup moves the chariots", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.setBothSetupsTo("Central Chariot");
    });

    then("they come in off the corners", async ({janggi}) => {
      expect(await janggi.board.getPieceAt(3, 10)).toEqual({side: "cho", type: "chariot"});
      expect(await janggi.board.getPieceAt(1, 10)).toEqual({side: "cho", type: "elephant"});
    });
  });

  when("nothing has been chosen yet", () => {
    then("both armies open on the common setup, with modern pieces on the classic board", async ({janggi}) => {
      expect(await janggi.settings.hanSetup.getSelected()).toBe("Inner Elephant");
      expect(await janggi.settings.choSetup.getSelected()).toBe("Inner Elephant");
      expect(await janggi.settings.pieceSet.getSelected()).toBe("Modern");
      expect(await janggi.settings.board.getSelected()).toBe("Classic");
    });
  });
});

/**
 * The asymmetric setups are where the two armies matter separately. Whether the outer elephants end
 * up on the same wing of the board or facing each other diagonally across it is the distinction the
 * game itself has names for — 엇상 against 맞상 — and it falls out of the two choices rather than
 * out of one setting, which is why each army is chosen on its own.
 */
given("the two armies are arranged separately", () => {
  when("both choose the same asymmetric setup", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.setBothSetupsTo("Left Elephant");
    });

    then("their outer elephants stand on the same wing", async ({janggi}) => {
      expect(await janggi.board.getPieceAt(2, 10)).toEqual({side: "cho", type: "elephant"});
      expect(await janggi.board.getPieceAt(2, 1)).toEqual({side: "han", type: "elephant"});
    });
  });

  when("they choose opposite asymmetric setups", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.choSetup.setTo("Left Elephant");
      await janggi.settings.hanSetup.setTo("Right Elephant");
    });

    then("their outer elephants end up on opposite wings", async ({janggi}) => {
      expect(await janggi.board.getPieceAt(2, 10)).toEqual({side: "cho", type: "elephant"});
      expect(await janggi.board.getPieceAt(8, 1)).toEqual({side: "han", type: "elephant"});
    });
  });

  when("only one army changes its arrangement", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.choSetup.setTo("Outer Elephant");
    });

    then("the other one is left where it stood", async ({janggi}) => {
      expect(await janggi.board.getPieceAt(2, 10)).toEqual({side: "cho", type: "elephant"});
      expect(await janggi.board.getPieceAt(2, 1)).toEqual({side: "han", type: "horse"});
      expect(await janggi.settings.hanSetup.getSelected()).toBe("Inner Elephant");
    });
  });
});
