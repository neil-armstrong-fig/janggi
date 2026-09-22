import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";
import {encodeKey} from "@janggi/shared/janggi/share-keys/EncodeKey";

/**
 * A piece in hand casts a shadow, in the colour its set gives it. Under `effects/` because a piece is only
 * lifted while the board's motion is on — the default projects run it reduced, and would find nothing held.
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

given("motion is left on, and a player is wearing a piece set with a red shadow for the piece in hand", () => {
  beforeEach(async ({janggi}) => {
    const styled = {...LETTERS, handling: {shadow: "rgba(255, 0, 0, 0.9)", hoverOutline: 2}};

    await janggi.stylesSheet.styleImporter.importStyle(encodeKey("pieces", styled));
    await janggi.settings.pieceSet.setOwnStyleTo("Letters");
  });

  when("cho picks up a soldier", () => {
    beforeEach(async ({janggi}) => {
      await janggi.board.tap(1, 7);
    });

    then("it casts the set's shadow", async ({janggi}) => {
      expect(await janggi.board.getHeldShadowAt(1, 7)).toContain("rgba(255, 0, 0, 0.9)");
    });
  });
});

given("motion is left on, and a player is wearing a piece set written before sets chose their shadows", () => {
  beforeEach(async ({janggi}) => {
    await janggi.stylesSheet.styleImporter.importStyle(encodeKey("pieces", LETTERS));
    await janggi.settings.pieceSet.setOwnStyleTo("Letters");
  });

  when("cho picks up a soldier", () => {
    beforeEach(async ({janggi}) => {
      await janggi.board.tap(1, 7);
    });

    then("it casts the dark shadow it always did", async ({janggi}) => {
      expect(await janggi.board.getHeldShadowAt(1, 7)).toContain("rgba(0, 0, 0, 0.45)");
    });
  });
});
