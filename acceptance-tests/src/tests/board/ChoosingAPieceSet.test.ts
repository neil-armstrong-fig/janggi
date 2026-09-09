import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";
import {PIECE_SET_NAMES} from "@janggi/shared/janggi/settings/PieceSetName";

/**
 * Four sets ship, and they differ only in what is marked on a piece and how the body is turned.
 * Which piece stands where never changes, which is what these check first: a player who cannot read
 * hanja should be swapping the writing, not the game.
 *
 * Cho's general sits on file 5, rank 9 and its soldiers on rank 7; Han's soldiers are on rank 4.
 */
given("a player is choosing a piece set", () => {
  when("the traditional set is chosen", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.pieceSet.setTo("Traditional");
    });

    then("the pieces carry the hanja a real set is cut with", async ({janggi}) => {
      expect(await janggi.board.getCharacterAt(5, 9)).toBe("楚");
      expect(await janggi.board.getCharacterAt(5, 2)).toBe("漢");
    });

    then("the two armies keep their different words for a foot soldier", async ({janggi}) => {
      expect(await janggi.board.getCharacterAt(1, 7)).toBe("卒");
      expect(await janggi.board.getCharacterAt(1, 4)).toBe("兵");
    });

    /** The one set turned in three sizes, so rank can be read by feel before a character is. */
    then("rank is legible by size", async ({janggi}) => {
      const general = await janggi.board.getPieceWidthAt(5, 9);
      const chariot = await janggi.board.getPieceWidthAt(1, 10);
      const soldier = await janggi.board.getPieceWidthAt(1, 7);

      expect(general).toBeGreaterThan(chariot ?? 0);
      expect(chariot).toBeGreaterThan(soldier ?? 0);
    });
  });

  when("the hanja set is chosen", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.pieceSet.setTo("Hanja");
    });

    then("the same characters are shown", async ({janggi}) => {
      expect(await janggi.board.getCharacterAt(5, 9)).toBe("楚");
      expect(await janggi.board.getCharacterAt(1, 7)).toBe("卒");
    });

    /** Unlike the traditional set, a modern one turns everything but the general at one size. */
    then("only the general is drawn larger than the rest", async ({janggi}) => {
      const general = await janggi.board.getPieceWidthAt(5, 9);
      const chariot = await janggi.board.getPieceWidthAt(1, 10);
      const soldier = await janggi.board.getPieceWidthAt(1, 7);

      expect(general).toBeGreaterThan(chariot ?? 0);
      // Within a pixel of each other rather than exactly equal: a piece is sized against its grid
      // track, and tracks rarely divide the board into whole device pixels.
      expect(chariot).toBeCloseTo(soldier ?? 0, 0);
    });
  });

  when("the hangul set is chosen", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.pieceSet.setTo("Hangul");
    });

    then("each piece is spelled out in the Korean alphabet", async ({janggi}) => {
      expect(await janggi.board.getCharacterAt(5, 9)).toBe("초");
      expect(await janggi.board.getCharacterAt(5, 2)).toBe("한");
      expect(await janggi.board.getCharacterAt(1, 7)).toBe("졸");
      expect(await janggi.board.getCharacterAt(1, 4)).toBe("병");
    });
  });

  when("the modern set is chosen", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.pieceSet.setTo("Modern");
    });

    then("the pieces carry no writing at all", async ({janggi}) => {
      expect(await janggi.board.getCharacterAt(5, 9)).toBeUndefined();
      expect(await janggi.board.getCharacterAt(1, 7)).toBeUndefined();
    });
  });

  /**
   * Read off the shared union, so a set added to the app is covered here without anyone
   * remembering to come back. A set *removed* is still caught: the four `when`s above name them
   * one at a time, and would stop compiling.
   */
  /**
   * The criteria above each choose one set from the default. This is the one that changes it
   * repeatedly, which is what the single looping criterion these replaced used to cover by
   * accident — a set is chosen over another that was itself chosen, not over the shipped default.
   */
  when("the set is changed several times over", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.pieceSet.setTo("Hangul");
      await janggi.settings.pieceSet.setTo("Modern");
      await janggi.settings.pieceSet.setTo("Hanja");
    });

    then("the set chosen last is the one in use", async ({janggi}) => {
      expect(await janggi.settings.pieceSet.getSelected()).toBe("Hanja");
      expect(await janggi.board.getCharacterAt(5, 9)).toBe("楚");
    });

    then("the game standing on the board is untouched by any of it", async ({janggi}) => {
      expect(await janggi.board.getPieceCount()).toBe(32);
      expect(await janggi.board.getPieceAt(5, 9)).toEqual({side: "cho", type: "general"});
      expect(await janggi.board.getPieceAt(1, 10)).toEqual({side: "cho", type: "chariot"});
    });
  });

  when.each(
    PIECE_SET_NAMES,
    set => `the set in use is ${set}`,
    set => {
      beforeEach(async ({janggi}) => {
        await janggi.settings.pieceSet.setTo(set);
      });

      then("it is the writing that changed and never the game", async ({janggi}) => {
        expect(await janggi.settings.pieceSet.getSelected()).toBe(set);
        expect(await janggi.board.getPieceCount()).toBe(32);
        expect(await janggi.board.getPieceAt(5, 9)).toEqual({side: "cho", type: "general"});
        expect(await janggi.board.getPieceAt(1, 10)).toEqual({side: "cho", type: "chariot"});
      });
    },
  );
});
