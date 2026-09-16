import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";
import {saveKeyWith} from "@src/shared/share-keys/SaveKeyWith";

/**
 * Past the first few, board styles and piece sets are earned with XP. Winning the games that earn it is
 * far deeper than a spec can tap, so each player here is given their XP by loading a save — the same
 * box a player moving device uses. What a game is worth is unit tested beneath the page.
 *
 * Every spec starts with everything unlocked (the fixture loads such a save), so each of these loads the
 * save it is about first.
 */
given("a player with no XP", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.progress.loadSave(saveKeyWith({xp: 0}));
  });

  when("they look at the boards on offer", () => {
    then("the classic board may be worn", async ({janggi}) => {
      expect(await janggi.settings.board.isLocked("Classic")).toBe(false);
    });

    then("every other board is locked", async ({janggi}) => {
      const boards = ["Neon", "Diagram", "Tournament", "Celadon", "Dancheong", "Hacker"] as const;

      expect(await Promise.all(boards.map(board => janggi.settings.board.isLocked(board)))).toEqual(
        boards.map(() => true),
      );
    });
  });

  when("they look at the piece sets on offer", () => {
    then("the traditional, hangul and modern sets may be worn", async ({janggi}) => {
      const sets = ["Traditional", "Hangul", "Modern"] as const;

      expect(await Promise.all(sets.map(set => janggi.settings.pieceSet.isLocked(set)))).toEqual([false, false, false]);
    });

    then("the hanja set is locked", async ({janggi}) => {
      expect(await janggi.settings.pieceSet.isLocked("Hanja")).toBe(true);
    });
  });

  when("they look at making a style of their own", () => {
    then("it is locked", async ({janggi}) => {
      expect(await janggi.stylesSheet.canMakeStyles()).toBe(false);
    });
  });
});

given("a player with 60 XP", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.progress.loadSave(saveKeyWith({xp: 60}));
  });

  when("they look at the boards on offer", () => {
    then("the neon board may be worn", async ({janggi}) => {
      expect(await janggi.settings.board.isLocked("Neon")).toBe(false);
    });

    then("the diagram board is still locked", async ({janggi}) => {
      expect(await janggi.settings.board.isLocked("Diagram")).toBe(true);
    });
  });

  when("they choose the neon board", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.board.setTo("Neon");
    });

    then("it is the board in use", async ({janggi}) => {
      expect(await janggi.settings.board.getSelected()).toBe("Neon");
    });
  });
});

given("a player one XP short of a million", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.progress.loadSave(saveKeyWith({xp: 999_999}));
  });

  when("they look for the hacker theme", () => {
    then("the hacker board is still locked", async ({janggi}) => {
      expect(await janggi.settings.board.isLocked("Hacker")).toBe(true);
    });

    then("the hacker pieces are still locked", async ({janggi}) => {
      expect(await janggi.settings.pieceSet.isLocked("Hacker")).toBe(true);
    });
  });
});

given("a player with a million XP", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.progress.loadSave(saveKeyWith({xp: 1_000_000}));
  });

  when("they choose the hacker board and pieces", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.board.setTo("Hacker");
      await janggi.settings.pieceSet.setTo("Hacker");
    });

    then("the hacker board is in use", async ({janggi}) => {
      expect(await janggi.settings.board.getSelected()).toBe("Hacker");
    });

    then("each general is marked the way a roguelike marks the player", async ({janggi}) => {
      expect(await janggi.board.getCharacterAt(5, 9)).toBe("@");
    });
  });
});

given("a player wearing the neon board", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.board.setTo("Neon");
  });

  when("they load a save with no XP in it", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.progress.loadSave(saveKeyWith({xp: 0}));
    });

    then("the classic board is worn in its place", async ({janggi}) => {
      expect(await janggi.settings.board.getSelected()).toBe("Classic");
    });
  });
});
