import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";
import {saveKeyWith} from "@src/shared/share-keys/SaveKeyWith";
import {encodeKey} from "@janggi/shared/janggi/share-keys/EncodeKey";

const SHARED_BOARD = {
  name: "Midnight",
  surface: "#101828",
  defaultCell: {stroke: "#e0e7ff", strokeWidth: 1},
  lastMove: {wash: "rgba(224, 231, 255, 0.2)", brackets: "#e0e7ff"},
};

const LETTERED_PIECE = {
  body: {shape: "disc", fill: "#ffffff", stroke: "#000000", strokeWidth: 2},
  glyph: {
    kind: "character",
    characters: {general: "K", guard: "A", horse: "N", elephant: "B", chariot: "R", cannon: "C", soldier: "P"},
    colour: "#000000",
    scale: 0.5,
    fontFamily: "sans-serif",
    fontWeight: 700,
  },
  size: 0.86,
};

const SHARED_PIECES = {name: "Letters", sides: {han: LETTERED_PIECE, cho: LETTERED_PIECE}};

/**
 * A style is shared as a key one player copies and another pastes. Nothing is ever uploaded, so nothing
 * has to be moderated — and importing a style costs no XP, since it is someone else's work being worn.
 */
given("a player with no XP is handed styles somebody else made", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.progress.loadSave(saveKeyWith({xp: 0}));
  });

  when("they import a board", () => {
    beforeEach(async ({janggi}) => {
      await janggi.stylesSheet.importStyle(encodeKey("board", SHARED_BOARD));
    });

    then("it is taken", async ({janggi}) => {
      expect(await janggi.stylesSheet.isImportRefused()).toBe(false);
    });

    then("it is among their own boards", async ({janggi}) => {
      expect(await janggi.stylesSheet.getOwnStyleNames("Board")).toEqual(["Midnight"]);
    });
  });

  when("they import a board and wear it", () => {
    beforeEach(async ({janggi}) => {
      await janggi.stylesSheet.importStyle(encodeKey("board", SHARED_BOARD));
      await janggi.settings.board.setOwnStyleTo("Midnight");
    });

    then("it is the board in use", async ({janggi}) => {
      expect(await janggi.settings.board.getSelectedName()).toBe("Midnight");
    });
  });

  when("they import a piece set and wear it", () => {
    beforeEach(async ({janggi}) => {
      await janggi.stylesSheet.importStyle(encodeKey("pieces", SHARED_PIECES));
      await janggi.settings.pieceSet.setOwnStyleTo("Letters");
    });

    then("it is among their own piece sets", async ({janggi}) => {
      expect(await janggi.stylesSheet.getOwnStyleNames("Pieces")).toEqual(["Letters"]);
    });

    then("the pieces carry its writing", async ({janggi}) => {
      expect(await janggi.board.getCharacterAt(5, 9)).toBe("K");
    });
  });

  when("they import a board that would load a picture from somewhere else", () => {
    beforeEach(async ({janggi}) => {
      const fetching = {...SHARED_BOARD, surface: "url(https://example.com/picture.png)"};
      await janggi.stylesSheet.importStyle(encodeKey("board", fetching));
    });

    then("it is refused", async ({janggi}) => {
      expect(await janggi.stylesSheet.isImportRefused()).toBe(true);
    });

    then("they are told which part of it is to blame", async ({janggi}) => {
      expect(await janggi.stylesSheet.getImportMessage()).toContain("style.surface");
    });

    then("nothing is added", async ({janggi}) => {
      expect(await janggi.stylesSheet.getOwnStyleNames("Board")).toEqual([]);
    });
  });

  when("they paste a save key where a style key goes", () => {
    beforeEach(async ({janggi}) => {
      await janggi.stylesSheet.importStyle(saveKeyWith({xp: 0}));
    });

    then("it is refused", async ({janggi}) => {
      expect(await janggi.stylesSheet.isImportRefused()).toBe(true);
    });
  });
});

given("a player who has imported a board", () => {
  beforeEach(async ({janggi}) => {
    await janggi.stylesSheet.importStyle(encodeKey("board", SHARED_BOARD));
  });

  when("they copy its key, delete it, and import the key they copied", () => {
    beforeEach(async ({janggi}) => {
      const key = await janggi.stylesSheet.getStyleKey("Board", "Midnight");
      await janggi.stylesSheet.deleteStyle("Board", "Midnight");
      await janggi.stylesSheet.importStyle(key);
    });

    then("it is back among their own boards", async ({janggi}) => {
      expect(await janggi.stylesSheet.getOwnStyleNames("Board")).toEqual(["Midnight"]);
    });
  });

  when("they delete it", () => {
    beforeEach(async ({janggi}) => {
      await janggi.stylesSheet.deleteStyle("Board", "Midnight");
    });

    then("it is gone", async ({janggi}) => {
      expect(await janggi.stylesSheet.getOwnStyleNames("Board")).toEqual([]);
    });
  });

  when("they import it a second time", () => {
    beforeEach(async ({janggi}) => {
      await janggi.stylesSheet.importStyle(encodeKey("board", SHARED_BOARD));
    });

    then("both are kept, the second under a name of its own", async ({janggi}) => {
      expect(await janggi.stylesSheet.getOwnStyleNames("Board")).toEqual(["Midnight", "Midnight (2)"]);
    });
  });
});
