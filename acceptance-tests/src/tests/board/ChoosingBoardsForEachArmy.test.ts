import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";
import {saveKeyWith} from "@src/shared/share-keys/SaveKeyWith";

/**
 * Nearly every player wants one board, so there is one picker and choosing a board dresses the whole
 * grid. A player who wants Neon for Han and Classic for Cho can choose them apart — and choosing apart
 * alone changes nothing on the board. Han holds ranks 1-5, Cho ranks 6-10.
 */
given("a player who has earned the neon board", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.progress.loadSave(saveKeyWith({xp: 60}));
  });

  when("they choose the classic board", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.board.setTo("Classic");
    });

    then("both halves are dressed in it", async ({janggi}) => {
      expect(await janggi.board.getLineColourAt(5, 2)).toBe("rgb(74, 49, 22)");
      expect(await janggi.board.getLineColourAt(5, 9)).toBe("rgb(74, 49, 22)");
      expect(await janggi.board.getSurfaceAt(2)).toBe("rgb(231, 200, 143)");
      expect(await janggi.board.getSurfaceAt(9)).toBe("rgb(231, 200, 143)");
    });

    then("the boards are not chosen apart", async ({janggi}) => {
      expect(await janggi.settings.board.isChosenApart()).toBe(false);
    });

    when("they choose the armies' boards apart", () => {
      beforeEach(async ({janggi}) => {
        await janggi.settings.board.toggleChoosingApart();
      });

      then("each half is still classic", async ({janggi}) => {
        expect(await janggi.settings.board.getSelectedNameForArmy("han")).toBe("Classic");
        expect(await janggi.settings.board.getSelectedNameForArmy("cho")).toBe("Classic");
        expect(await janggi.board.getLineColourAt(5, 2)).toBe("rgb(74, 49, 22)");
      });

      when("they give han the neon board", () => {
        beforeEach(async ({janggi}) => {
          await janggi.settings.board.chooseForArmy("han", "Neon");
        });

        then("han's half is neon, lines and background both", async ({janggi}) => {
          expect(await janggi.board.getLineColourAt(5, 2)).toBe("rgb(47, 111, 143)");
          expect(await janggi.board.getSurfaceAt(2)).toContain("linear-gradient");
        });

        then("cho's half is still classic, lines and background both", async ({janggi}) => {
          expect(await janggi.board.getLineColourAt(5, 9)).toBe("rgb(74, 49, 22)");
          expect(await janggi.board.getSurfaceAt(9)).toBe("rgb(231, 200, 143)");
        });

        when("they put both halves back in one board", () => {
          beforeEach(async ({janggi}) => {
            await janggi.settings.board.toggleChoosingApart();
          });

          then("both are classic, and the boards are no longer chosen apart", async ({janggi}) => {
            expect(await janggi.settings.board.isChosenApart()).toBe(false);
            expect(await janggi.board.getLineColourAt(5, 2)).toBe("rgb(74, 49, 22)");
            expect(await janggi.board.getSurfaceAt(2)).toBe("rgb(231, 200, 143)");
          });
        });
      });

      when("they give cho the neon board", () => {
        beforeEach(async ({janggi}) => {
          await janggi.settings.board.chooseForArmy("cho", "Neon");
        });

        then("cho's half is neon and han's is still classic", async ({janggi}) => {
          expect(await janggi.board.getLineColourAt(5, 9)).toBe("rgb(47, 111, 143)");
          expect(await janggi.board.getLineColourAt(5, 2)).toBe("rgb(74, 49, 22)");
        });
      });
    });
  });
});
