import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";
import {saveKeyWith} from "@src/shared/share-keys/SaveKeyWith";

/**
 * Nearly every player wants one set of pieces, so there is one picker and choosing a set dresses both armies.
 * A player who wants Hanja for Han and Hangul for Cho can choose them apart — and choosing apart alone
 * changes nothing on the board.
 */
given("a player who has earned the hanja set", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.progress.loadSave(saveKeyWith({xp: 30}));
  });

  when("they choose the hangul set", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.pieceSet.setTo("Hangul");
    });

    then("both armies are dressed in it", async ({janggi}) => {
      expect(await janggi.board.getCharacterAt(5, 2)).toBe("한");
      expect(await janggi.board.getCharacterAt(5, 9)).toBe("초");
    });

    then("the armies are not chosen apart", async ({janggi}) => {
      expect(await janggi.settings.pieceSet.isChosenApart()).toBe(false);
    });

    when("they choose the armies' pieces apart", () => {
      beforeEach(async ({janggi}) => {
        await janggi.settings.pieceSet.toggleChoosingApart();
      });

      then("each army is still in the hangul set", async ({janggi}) => {
        expect(await janggi.settings.pieceSet.getSelectedNameForArmy("han")).toBe("Hangul");
        expect(await janggi.settings.pieceSet.getSelectedNameForArmy("cho")).toBe("Hangul");
        expect(await janggi.board.getCharacterAt(5, 2)).toBe("한");
      });

      when("they give han the hanja set", () => {
        beforeEach(async ({janggi}) => {
          await janggi.settings.pieceSet.chooseForArmy("han", "Hanja");
        });

        then("han's pieces are in hanja, the general included", async ({janggi}) => {
          expect(await janggi.board.getCharacterAt(5, 2)).toBe("漢");
          expect(await janggi.board.getCharacterAt(1, 1)).toBe("車");
        });

        then("cho's are still in hangul", async ({janggi}) => {
          expect(await janggi.board.getCharacterAt(5, 9)).toBe("초");
          expect(await janggi.board.getCharacterAt(1, 10)).toBe("차");
        });

        when("they put both armies back in one set", () => {
          beforeEach(async ({janggi}) => {
            await janggi.settings.pieceSet.toggleChoosingApart();
          });

          then("both are in cho's, and the armies are no longer chosen apart", async ({janggi}) => {
            expect(await janggi.settings.pieceSet.isChosenApart()).toBe(false);
            expect(await janggi.board.getCharacterAt(5, 2)).toBe("한");
          });
        });
      });

      when("they give cho the hanja set", () => {
        beforeEach(async ({janggi}) => {
          await janggi.settings.pieceSet.chooseForArmy("cho", "Hanja");
        });

        then("cho's pieces are in hanja and han's are still in hangul", async ({janggi}) => {
          expect(await janggi.board.getCharacterAt(5, 9)).toBe("楚");
          expect(await janggi.board.getCharacterAt(5, 2)).toBe("한");
        });
      });
    });
  });
});
