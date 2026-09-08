import {expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("a user opens the game for the first time", () => {
  when("the board has been set up", () => {
    then("both armies are on it in full", async ({janggi}) => {
      const pieces = await janggi.board.countPieces();

      expect(pieces).toBe(32);
    });

    then("each general stands on the centre of its own palace", async ({janggi}) => {
      expect(await janggi.board.pieceAt(5, 2)).toEqual({side: "han", type: "general"});
      expect(await janggi.board.pieceAt(5, 9)).toEqual({side: "cho", type: "general"});
    });

    then("the chariots hold the corners", async ({janggi}) => {
      expect(await janggi.board.pieceAt(1, 1)).toEqual({side: "han", type: "chariot"});
      expect(await janggi.board.pieceAt(9, 10)).toEqual({side: "cho", type: "chariot"});
    });

    then("the five soldiers stand on the odd files, three ranks ahead of the back rank", async ({janggi}) => {
      expect(await janggi.board.pieceAt(1, 7)).toEqual({side: "cho", type: "soldier"});
      expect(await janggi.board.pieceAt(5, 7)).toEqual({side: "cho", type: "soldier"});
      expect(await janggi.board.pieceAt(9, 7)).toEqual({side: "cho", type: "soldier"});
      expect(await janggi.board.pieceAt(2, 7)).toBeUndefined();
    });

    then("the rank in front of the soldiers is empty", async ({janggi}) => {
      expect(await janggi.board.pieceAt(5, 5)).toBeUndefined();
      expect(await janggi.board.pieceAt(5, 6)).toBeUndefined();
    });
  });
});
