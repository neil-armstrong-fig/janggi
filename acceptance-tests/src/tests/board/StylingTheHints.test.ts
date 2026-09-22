import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";
import {encodeKey} from "@janggi/shared/janggi/share-keys/EncodeKey";

/**
 * The marks that help a player choose a move — the dot on a point the piece in hand may go to, and the wash
 * over the piece in hand — are drawn in the colours the board's style gives them, since no one colour reads
 * on every board. A board written before it could say still draws them as they always were.
 */
const MIDNIGHT = {
  name: "Midnight",
  surface: "#101828",
  defaultCell: {stroke: "#e0e7ff", strokeWidth: 1},
  lastMove: {wash: "rgba(224, 231, 255, 0.2)", brackets: "#e0e7ff"},
};

given("a player wearing a board that picks its own colours for the hints", () => {
  beforeEach(async ({janggi}) => {
    const styled = {...MIDNIGHT, hints: {colour: "#ff0000", outline: "#000000", selection: "rgba(0, 255, 0, 0.3)"}};

    await janggi.stylesSheet.styleImporter.importStyle(encodeKey("board", styled));
    await janggi.settings.board.setOwnStyleTo("Midnight");
  });

  when("cho picks up a soldier", () => {
    beforeEach(async ({janggi}) => {
      await janggi.board.tap(1, 7);
    });

    then("the dot on the point it may go to is in the board's colour, mostly solid", async ({janggi}) => {
      expect(await janggi.board.getMoveHintColourAt(1, 6)).toBe("color(srgb 1 0 0 / 0.7)");
    });

    then("the soldier's own point is washed in the board's colour for it", async ({janggi}) => {
      expect(await janggi.board.getSelectionColourAt(1, 7)).toBe("rgba(0, 255, 0, 0.3)");
    });
  });
});

given("a player wearing a board written before boards carried colours for the hints", () => {
  beforeEach(async ({janggi}) => {
    await janggi.stylesSheet.styleImporter.importStyle(encodeKey("board", MIDNIGHT));
    await janggi.settings.board.setOwnStyleTo("Midnight");
  });

  when("cho picks up a soldier", () => {
    beforeEach(async ({janggi}) => {
      await janggi.board.tap(1, 7);
    });

    then("the dot is the white it always was", async ({janggi}) => {
      expect(await janggi.board.getMoveHintColourAt(1, 6)).toBe("color(srgb 1 1 1 / 0.7)");
    });

    then("the wash is the pale white it always was", async ({janggi}) => {
      expect(await janggi.board.getSelectionColourAt(1, 7)).toBe("rgba(255, 255, 255, 0.2)");
    });
  });
});
