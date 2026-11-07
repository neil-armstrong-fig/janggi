import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";
import {saveKeyWith} from "@src/shared/share-keys/SaveKeyWith";

/**
 * A piece may be drawn from an SVG file of the player's own. It is fitted to the piece's box, and it goes on
 * every piece of the army the controls are changing — the general, which the set gives a style of its own, too.
 */

/** A square SVG, which fills the piece's whole box once it is fitted. */
const SQUARE = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><path d="M0 0 H10 V10 H0 Z"/></svg>';

given("a player with the XP to make a style, and the drawn set to start from", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.you.progress.loadSave(saveKeyWith({xp: 300}));
    await janggi.settings.openTheSettings();
    await janggi.settings.selectTab("Look");
    await janggi.stylesSheet.openStyles();
    await janggi.stylesSheet.styleStarter.start("Pieces", "Modern");
    await janggi.stylesSheet.closeStyles();
  });

  when("they choose an SVG for the horse", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.openTheSettings();
      await janggi.settings.selectTab("Look");
      await janggi.stylesSheet.openStyles();
      await janggi.stylesSheet.styleEditor.controls.importDrawing("horse", SQUARE);
      await janggi.stylesSheet.closeStyles();
    });

    then("every one of cho's horses is drawn with it, fitted to the piece", async ({janggi}) => {
      expect(await janggi.stylesSheet.styleEditor.preview.getDrawingAt(2, 10)).toBe("M0 0 H100 V100 H0 Z");
      expect(await janggi.stylesSheet.styleEditor.preview.getDrawingAt(8, 10)).toBe("M0 0 H100 V100 H0 Z");
    });

    then("han's horses are still drawn as they were", async ({janggi}) => {
      expect(await janggi.stylesSheet.styleEditor.preview.getDrawingAt(2, 1)).not.toBe("M0 0 H100 V100 H0 Z");
    });

    then("cho's other pieces are still drawn as they were", async ({janggi}) => {
      expect(await janggi.stylesSheet.styleEditor.preview.getDrawingAt(1, 10)).not.toBe("M0 0 H100 V100 H0 Z");
    });

    then("nothing is said against it", async ({janggi}) => {
      expect(await janggi.stylesSheet.styleEditor.controls.getDrawingMessage("horse")).toBeUndefined();
    });
  });

  when("they choose an SVG for the general, which the set draws a style of its own", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.openTheSettings();
      await janggi.settings.selectTab("Look");
      await janggi.stylesSheet.openStyles();
      await janggi.stylesSheet.styleEditor.controls.importDrawing("general", SQUARE);
      await janggi.stylesSheet.closeStyles();
    });

    then("cho's general is drawn with it", async ({janggi}) => {
      expect(await janggi.stylesSheet.styleEditor.preview.getDrawingAt(5, 9)).toBe("M0 0 H100 V100 H0 Z");
    });
  });

  when("they choose a file that is not an SVG", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.openTheSettings();
      await janggi.settings.selectTab("Look");
      await janggi.stylesSheet.openStyles();
      await janggi.stylesSheet.styleEditor.controls.importDrawing("chariot", "not a drawing");
      await janggi.stylesSheet.closeStyles();
    });

    then("they are told, beside the piece it was for", async ({janggi}) => {
      expect(await janggi.stylesSheet.styleEditor.controls.getDrawingMessage("chariot")).toContain("not an SVG");
    });

    then("the piece keeps the drawing it had", async ({janggi}) => {
      expect(await janggi.stylesSheet.styleEditor.preview.getDrawingAt(1, 10)).not.toBe("M0 0 H100 V100 H0 Z");
    });
  });
});
