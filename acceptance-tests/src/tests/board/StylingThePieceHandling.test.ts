import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";
import {encodeKey} from "@janggi/shared/janggi/share-keys/EncodeKey";

/**
 * A piece set says how its outline answers the pointer: every outline is drawn thicker under it, by the
 * factor the set gives, so a set of hairlines and one of heavy edges both thicken alike.
 */
const PIECE = {
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

const LETTERS = {name: "Letters", sides: {han: PIECE, cho: PIECE}};

given("a player wearing a piece set that thickens its outlines threefold under the pointer", () => {
  beforeEach(async ({janggi}) => {
    const styled = {...LETTERS, handling: {shadow: "rgba(0, 0, 0, 0.45)", hoverOutline: 3}};

    await janggi.stylesSheet.styleImporter.importStyle(encodeKey("pieces", styled));
    await janggi.settings.pieceSet.setOwnStyleTo("Letters");
  });

  then("a piece's outline is drawn as the set says while nothing is over it", async ({janggi}) => {
    expect(await janggi.board.getPieceOutlineWidthAt(1, 7)).toBe(2);
  });

  when("the pointer rests on a piece", () => {
    beforeEach(async ({janggi}) => {
      await janggi.board.hover(1, 7);
    });

    then("its outline is three times as thick", async ({janggi}) => {
      expect(await janggi.board.getPieceOutlineWidthAt(1, 7)).toBe(6);
    });

    then("no other piece's is", async ({janggi}) => {
      expect(await janggi.board.getPieceOutlineWidthAt(3, 7)).toBe(2);
    });
  });
});

given("a player wearing a piece set written before sets could say how they are handled", () => {
  beforeEach(async ({janggi}) => {
    await janggi.stylesSheet.styleImporter.importStyle(encodeKey("pieces", LETTERS));
    await janggi.settings.pieceSet.setOwnStyleTo("Letters");
  });

  when("the pointer rests on a piece", () => {
    beforeEach(async ({janggi}) => {
      await janggi.board.hover(1, 7);
    });

    then("its outline thickens by two and a quarter, as it always did", async ({janggi}) => {
      expect(await janggi.board.getPieceOutlineWidthAt(1, 7)).toBe(4.5);
    });
  });
});
