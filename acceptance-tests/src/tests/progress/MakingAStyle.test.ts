import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";
import {saveKeyWith} from "@src/shared/share-keys/SaveKeyWith";

/**
 * Making a style of one's own is earned with XP, where importing one is not. The editor starts from a
 * style the player already has, so the JSON it opens with is always a style that works — which is what
 * lets a spec make one without writing any.
 */
given("a player without the XP to make a style", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.progress.loadSave(saveKeyWith({xp: 299}));
  });

  when("they look at making one", () => {
    then("it is locked", async ({janggi}) => {
      expect(await janggi.stylesSheet.canMakeStyles()).toBe(false);
    });
  });
});

given("a player with the XP to make a style", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.progress.loadSave(saveKeyWith({xp: 300}));
  });

  when("they make a board from the classic one, under a name of their own", () => {
    beforeEach(async ({janggi}) => {
      await janggi.stylesSheet.makeStyle("Board", "Classic", "My board");
    });

    then("it is saved", async ({janggi}) => {
      expect(await janggi.stylesSheet.isEditorRefused()).toBe(false);
    });

    then("it is among their own boards", async ({janggi}) => {
      expect(await janggi.stylesSheet.getOwnStyleNames("Board")).toEqual(["My board"]);
    });

    then("the board is wearing it", async ({janggi}) => {
      expect(await janggi.settings.board.getSelectedName()).toBe("My board");
    });
  });

  when("they make a piece set from the hangul one", () => {
    beforeEach(async ({janggi}) => {
      await janggi.stylesSheet.makeStyle("Pieces", "Hangul", "My pieces");
    });

    then("the pieces are wearing it", async ({janggi}) => {
      expect(await janggi.settings.pieceSet.getSelectedName()).toBe("My pieces");
    });

    then("it carries the writing of the set it started from", async ({janggi}) => {
      expect(await janggi.board.getCharacterAt(5, 9)).toBe("초");
    });
  });

  when("they try to give their board a built-in's name", () => {
    beforeEach(async ({janggi}) => {
      await janggi.stylesSheet.makeStyle("Board", "Classic", "Neon");
    });

    then("it is refused", async ({janggi}) => {
      expect(await janggi.stylesSheet.isEditorRefused()).toBe(true);
    });

    then("nothing is added", async ({janggi}) => {
      expect(await janggi.stylesSheet.getOwnStyleNames("Board")).toEqual([]);
    });
  });

  when("they save JSON that will not parse", () => {
    beforeEach(async ({janggi}) => {
      await janggi.stylesSheet.makeStyle("Board", "Classic", "Broken", "{");
    });

    then("it is refused", async ({janggi}) => {
      expect(await janggi.stylesSheet.isEditorRefused()).toBe(true);
    });
  });
});
