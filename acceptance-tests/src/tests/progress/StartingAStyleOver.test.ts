import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";
import {encodeKey} from "@janggi/shared/janggi/share-keys/EncodeKey";
import {saveKeyWith} from "@src/shared/share-keys/SaveKeyWith";

/** Classic's lines are `#4a3116`, ink on pale wood. */
const CLASSIC_INK = "rgb(74, 49, 22)";

/**
 * A style being made can be started over without leaving the editor: put back as it was opened, or loaded
 * from another the player has, or from a key somebody shared.
 */
const MIDNIGHT = {
  name: "Midnight",
  surface: "#101828",
  defaultCell: {stroke: "#0000ff", strokeWidth: 1},
  lastMove: {wash: "rgba(224, 231, 255, 0.2)", brackets: "#e0e7ff"},
};

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

given("a player making a board from the classic one", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.you.progress.loadSave(saveKeyWith({xp: 300}));
    await janggi.stylesSheet.styleStarter.start("Board", "Classic");
  });

  when("they change the colour of its lines and reset it", () => {
    beforeEach(async ({janggi}) => {
      await janggi.stylesSheet.styleEditor.controls.setColour("line-colour", "#ff0000");
      await janggi.stylesSheet.styleEditor.tools.reset();
    });

    then("the lines are classic's again, on the preview and in the control", async ({janggi}) => {
      expect(await janggi.stylesSheet.styleEditor.preview.getLineColourAt(5, 5)).toBe(CLASSIC_INK);
      expect(await janggi.stylesSheet.styleEditor.controls.getColour("line-colour")).toBe("#4a3116");
    });
  });

  when("they load neon, which they have", () => {
    beforeEach(async ({janggi}) => {
      await janggi.stylesSheet.styleEditor.tools.loadFrom("Neon", "both");
    });

    then("the preview wears it", async ({janggi}) => {
      expect(await janggi.stylesSheet.styleEditor.preview.getLineColourAt(5, 5)).toBe("rgb(47, 111, 143)");
    });

    then("the controls show it", async ({janggi}) => {
      expect(await janggi.stylesSheet.styleEditor.controls.getColour("line-colour")).toBe("#2f6f8f");
    });

    when("they reset it", () => {
      beforeEach(async ({janggi}) => {
        await janggi.stylesSheet.styleEditor.tools.reset();
      });

      then("it is the classic board they began with, not neon", async ({janggi}) => {
        expect(await janggi.stylesSheet.styleEditor.preview.getLineColourAt(5, 5)).toBe(CLASSIC_INK);
      });
    });
  });

  when("they load a board key somebody shared", () => {
    beforeEach(async ({janggi}) => {
      await janggi.stylesSheet.styleEditor.tools.loadKey(encodeKey("board", MIDNIGHT));
    });

    then("it is taken, and the preview wears it", async ({janggi}) => {
      expect(await janggi.stylesSheet.styleEditor.tools.isLoadRefused()).toBe(false);
      expect(await janggi.stylesSheet.styleEditor.preview.getLineColourAt(5, 5)).toBe("rgb(0, 0, 255)");
    });
  });

  when("they load a piece set key into it", () => {
    beforeEach(async ({janggi}) => {
      await janggi.stylesSheet.styleEditor.tools.loadKey(encodeKey("pieces", LETTERS));
    });

    then("it is refused, and the board is as it was", async ({janggi}) => {
      expect(await janggi.stylesSheet.styleEditor.tools.isLoadRefused()).toBe(true);
      expect(await janggi.stylesSheet.styleEditor.preview.getLineColourAt(5, 5)).toBe(CLASSIC_INK);
    });
  });

  then("the name box is empty, a built-in's name being one it cannot save under", async ({janggi}) => {
    expect(await janggi.stylesSheet.styleEditor.getName()).toBe("");
  });
});

given("a player making a piece set from the hangul one", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.you.progress.loadSave(saveKeyWith({xp: 300}));
    await janggi.stylesSheet.styleStarter.start("Pieces", "Hangul");
  });

  when("they load han's pieces from the hanja set", () => {
    beforeEach(async ({janggi}) => {
      await janggi.stylesSheet.styleEditor.tools.loadFrom("Hanja", "han");
    });

    then("han's pieces are in hanja, the general too", async ({janggi}) => {
      expect(await janggi.stylesSheet.styleEditor.preview.getCharacterAt(5, 2)).toBe("漢");
      expect(await janggi.stylesSheet.styleEditor.preview.getCharacterAt(1, 1)).toBe("車");
    });

    then("cho's are still in hangul", async ({janggi}) => {
      expect(await janggi.stylesSheet.styleEditor.preview.getCharacterAt(5, 9)).toBe("초");
    });

    when("they reset it", () => {
      beforeEach(async ({janggi}) => {
        await janggi.stylesSheet.styleEditor.tools.reset();
      });

      then("han's pieces are in hangul again", async ({janggi}) => {
        expect(await janggi.stylesSheet.styleEditor.preview.getCharacterAt(5, 2)).toBe("한");
      });
    });
  });

  when("they load the whole hanja set", () => {
    beforeEach(async ({janggi}) => {
      await janggi.stylesSheet.styleEditor.tools.loadFrom("Hanja", "both");
    });

    then("both armies are in hanja", async ({janggi}) => {
      expect(await janggi.stylesSheet.styleEditor.preview.getCharacterAt(5, 2)).toBe("漢");
      expect(await janggi.stylesSheet.styleEditor.preview.getCharacterAt(5, 9)).toBe("楚");
    });
  });
});
