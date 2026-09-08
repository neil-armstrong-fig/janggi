import {expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * Four sets ship, and they differ only in what is marked on a piece and how the body is turned.
 * Which piece stands where never changes, which is what these check first: a player who cannot read
 * hanja should be swapping the writing, not the game.
 *
 * Cho's general sits on file 5, rank 9 and its soldiers on rank 7; Han's soldiers are on rank 4.
 */
given("a player is choosing a piece set", () => {
  when("the traditional set is chosen", () => {
    then("the pieces carry the hanja a real set is cut with", async ({janggi}) => {
      await janggi.settings.setPieceSetTo("Traditional");

      expect(await janggi.board.characterAt(5, 9)).toBe("楚");
      expect(await janggi.board.characterAt(5, 2)).toBe("漢");
    });

    then("the two armies keep their different words for a foot soldier", async ({janggi}) => {
      await janggi.settings.setPieceSetTo("Traditional");

      expect(await janggi.board.characterAt(1, 7)).toBe("卒");
      expect(await janggi.board.characterAt(1, 4)).toBe("兵");
    });

    /** The one set turned in three sizes, so rank can be read by feel before a character is. */
    then("rank is legible by size", async ({janggi}) => {
      await janggi.settings.setPieceSetTo("Traditional");

      const general = await janggi.board.pieceWidthAt(5, 9);
      const chariot = await janggi.board.pieceWidthAt(1, 10);
      const soldier = await janggi.board.pieceWidthAt(1, 7);

      expect(general).toBeGreaterThan(chariot ?? 0);
      expect(chariot).toBeGreaterThan(soldier ?? 0);
    });
  });

  when("the hanja set is chosen", () => {
    then("the same characters are shown", async ({janggi}) => {
      await janggi.settings.setPieceSetTo("Hanja");

      expect(await janggi.board.characterAt(5, 9)).toBe("楚");
      expect(await janggi.board.characterAt(1, 7)).toBe("卒");
    });

    /** Unlike the traditional set, a modern one turns everything but the general at one size. */
    then("only the general is drawn larger than the rest", async ({janggi}) => {
      await janggi.settings.setPieceSetTo("Hanja");

      const general = await janggi.board.pieceWidthAt(5, 9);
      const chariot = await janggi.board.pieceWidthAt(1, 10);
      const soldier = await janggi.board.pieceWidthAt(1, 7);

      expect(general).toBeGreaterThan(chariot ?? 0);
      // Within a pixel of each other rather than exactly equal: a piece is sized against its grid
      // track, and tracks rarely divide the board into whole device pixels.
      expect(chariot).toBeCloseTo(soldier ?? 0, 0);
    });
  });

  when("the hangul set is chosen", () => {
    then("each piece is spelled out in the Korean alphabet", async ({janggi}) => {
      await janggi.settings.setPieceSetTo("Hangul");

      expect(await janggi.board.characterAt(5, 9)).toBe("초");
      expect(await janggi.board.characterAt(5, 2)).toBe("한");
      expect(await janggi.board.characterAt(1, 7)).toBe("졸");
      expect(await janggi.board.characterAt(1, 4)).toBe("병");
    });
  });

  when("the modern set is chosen", () => {
    then("the pieces carry no writing at all", async ({janggi}) => {
      await janggi.settings.setPieceSetTo("Modern");

      expect(await janggi.board.characterAt(5, 9)).toBeUndefined();
      expect(await janggi.board.characterAt(1, 7)).toBeUndefined();
    });
  });

  when("any set is chosen", () => {
    then("it is the writing that changes and never the game", async ({janggi}) => {
      for (const set of ["Traditional", "Hanja", "Hangul", "Modern"] as const) {
        await janggi.settings.setPieceSetTo(set);

        expect(await janggi.settings.selectedPieceSet()).toBe(set);
        expect(await janggi.board.countPieces()).toBe(32);
        expect(await janggi.board.pieceAt(5, 9)).toEqual({side: "cho", type: "general"});
        expect(await janggi.board.pieceAt(1, 10)).toEqual({side: "cho", type: "chariot"});
      }
    });
  });
});
