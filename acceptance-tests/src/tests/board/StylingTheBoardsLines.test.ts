import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";
import {encodeKey} from "@janggi/shared/janggi/share-keys/EncodeKey";

/**
 * The lines drawn across the board — a check's, and a bikjang's — belong to the board's style, as the
 * last move's marks do: no one colour reads on every board, and the red of a check all but vanishes on
 * a lacquer-red one. A style written before boards carried them still loads, and draws them as it always did.
 */
const MIDNIGHT = {
  name: "Midnight",
  surface: "#101828",
  defaultCell: {stroke: "#e0e7ff", strokeWidth: 1},
  lastMove: {wash: "rgba(224, 231, 255, 0.2)", brackets: "#e0e7ff"},
};

const DEFAULT_BIKJANG = "rgb(244, 201, 93)";
const DEFAULT_CHECK = "rgb(240, 82, 74)";

given("a player wearing a board that picks its own colours for the lines", () => {
  beforeEach(async ({janggi}) => {
    const styled = {...MIDNIGHT, bikjang: {colour: "#ff00ff", width: 6}, check: {colour: "#00ffff"}};

    await janggi.stylesSheet.styleImporter.importStyle(encodeKey("board", styled));
    await janggi.settings.board.setOwnStyleTo("Midnight");
  });

  when("the generals come to face each other and cho calls the bikjang", () => {
    beforeEach(async ({janggi}) => {
      await janggi.board.tap(5, 7);
      await janggi.board.tap(4, 7);
      await janggi.board.tap(5, 4);
      await janggi.board.tap(4, 4);
      await janggi.status.callBikjang();
    });

    then("the line between the generals is in the board's colour", async ({janggi}) => {
      expect(await janggi.board.getBikjangLineColour()).toBe("rgb(255, 0, 255)");
    });

    then("it is as thick as the board says", async ({janggi}) => {
      expect(await janggi.board.getBikjangLineWidth()).toBe(6);
    });
  });

  when("cho puts han's general in check", () => {
    beforeEach(async ({janggi}) => {
      await janggi.board.tap(1, 10);
      await janggi.board.tap(1, 9);
      await janggi.board.tap(5, 2);
      await janggi.board.tap(4, 2);
      await janggi.board.tap(1, 9);
      await janggi.board.tap(4, 9);
    });

    then("the line from the attacker is in the board's colour", async ({janggi}) => {
      expect(await janggi.board.getCheckLineColour()).toBe("rgb(0, 255, 255)");
    });
  });
});

given("a player wearing a board written before boards carried those colours", () => {
  beforeEach(async ({janggi}) => {
    await janggi.stylesSheet.styleImporter.importStyle(encodeKey("board", MIDNIGHT));
    await janggi.settings.board.setOwnStyleTo("Midnight");
  });

  when("the generals come to face each other and cho calls the bikjang", () => {
    beforeEach(async ({janggi}) => {
      await janggi.board.tap(5, 7);
      await janggi.board.tap(4, 7);
      await janggi.board.tap(5, 4);
      await janggi.board.tap(4, 4);
      await janggi.status.callBikjang();
    });

    then("the line is the gold it always was", async ({janggi}) => {
      expect(await janggi.board.getBikjangLineColour()).toBe(DEFAULT_BIKJANG);
    });
  });

  when("cho puts han's general in check", () => {
    beforeEach(async ({janggi}) => {
      await janggi.board.tap(1, 10);
      await janggi.board.tap(1, 9);
      await janggi.board.tap(5, 2);
      await janggi.board.tap(4, 2);
      await janggi.board.tap(1, 9);
      await janggi.board.tap(4, 9);
    });

    then("the line is the red it always was", async ({janggi}) => {
      expect(await janggi.board.getCheckLineColour()).toBe(DEFAULT_CHECK);
    });
  });
});
