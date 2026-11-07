import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";
import {saveKeyWith} from "@src/shared/share-keys/SaveKeyWith";

/**
 * The styles sheet reads in Korean, from the list of a player's own styles to the last control of the editor. A style
 * keeps its own name, as a proper name, and JSON is called JSON. So do the checker's notes on a field of a style somebody
 * wrote by hand (`style.surface should be…`), which name a place in the JSON and stay as they are.
 */
given("a player who reads the game in Korean", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.you.language.setTo("ko");
    await janggi.languageNotice.dismissIt();
  });

  when("they have not yet earned the style editor", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.you.progress.loadSave(saveKeyWith({xp: 0}));
      await janggi.settings.openTheSettings();
      await janggi.settings.selectTab("Look");
      await janggi.stylesSheet.openStyles();
    });

    then("what it costs is said in Korean", async ({janggi}) => {
      const words = await janggi.stylesSheet.getWords();

      expect(words).toContain("300 XP에 해금됩니다");
      expect(words).not.toContain("unlocks at");
    });
  });

  when("they open their styles", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.openTheSettings();
      await janggi.settings.selectTab("Look");
      await janggi.stylesSheet.openStyles();
    });

    then("the sheet is in Korean", async ({janggi}) => {
      const words = await janggi.stylesSheet.getWords();

      expect(words).toContain("직접 만들기");
      expect(words).toContain("가져오기");
      expect(words).toContain("아직 없습니다");
      expect(words).not.toContain("Make your own");
      expect(words).not.toContain("Paste a key");
    });
  });

  when("they paste something that is not a key", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.openTheSettings();
      await janggi.settings.selectTab("Look");
      await janggi.stylesSheet.openStyles();
      await janggi.stylesSheet.styleImporter.importStyle("not a key");
      await janggi.stylesSheet.closeStyles();
    });

    then("they are told so in Korean", async ({janggi}) => {
      expect(await janggi.stylesSheet.styleImporter.getMessage()).toContain("판 또는 말 키가 아닙니다");
    });
  });

  when("they start making a board", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.openTheSettings();
      await janggi.settings.selectTab("Look");
      await janggi.stylesSheet.openStyles();
      await janggi.stylesSheet.styleStarter.start("Board", "Classic");
      await janggi.stylesSheet.closeStyles();
    });

    then("its controls and the ways to show it are in Korean", async ({janggi}) => {
      const words = await janggi.stylesSheet.getWords();

      expect(words).toContain("판 색");
      expect(words).toContain("선 색");
      expect(words).toContain("마지막 수");
      expect(words).toContain("불러오기 또는 되돌리기");
      expect(words).not.toContain("Line colour");
      expect(words).not.toContain("Load or reset");
      expect(words).not.toContain("opening");
    });

    then("what the controls change is named in Korean", async ({janggi}) => {
      expect(await janggi.stylesSheet.styleEditor.preview.getTarget()).toBe("모든 교차점");
    });

    when("they tap one point of it", () => {
      beforeEach(async ({janggi}) => {
        await janggi.settings.openTheSettings();
        await janggi.settings.selectTab("Look");
        await janggi.stylesSheet.openStyles();
        await janggi.stylesSheet.styleEditor.preview.tap(5, 5);
        await janggi.stylesSheet.closeStyles();
      });

      then("that point is named in Korean", async ({janggi}) => {
        expect(await janggi.stylesSheet.styleEditor.preview.getTarget()).toContain("교차점 ");
      });
    });

    when("they save it with no name", () => {
      beforeEach(async ({janggi}) => {
        await janggi.settings.openTheSettings();
        await janggi.settings.selectTab("Look");
        await janggi.stylesSheet.openStyles();
        await janggi.stylesSheet.styleEditor.save();
        await janggi.stylesSheet.closeStyles();
      });

      then("they are asked for one in Korean", async ({janggi}) => {
        expect(await janggi.stylesSheet.styleEditor.getMessage()).toContain("스타일 이름을 정하세요");
      });
    });

    when("they save it under a name", () => {
      beforeEach(async ({janggi}) => {
        await janggi.settings.openTheSettings();
        await janggi.settings.selectTab("Look");
        await janggi.stylesSheet.openStyles();
        await janggi.stylesSheet.styleEditor.save("내 판");
        await janggi.stylesSheet.closeStyles();
      });

      then("they are told in Korean that it is saved and worn", async ({janggi}) => {
        const message = await janggi.stylesSheet.styleEditor.getMessage();

        expect(message).toContain("내 판");
        expect(message).toContain("저장했습니다");
      });
    });

    when("they write something in the JSON that will not parse", () => {
      beforeEach(async ({janggi}) => {
        await janggi.settings.openTheSettings();
        await janggi.settings.selectTab("Look");
        await janggi.stylesSheet.openStyles();
        await janggi.stylesSheet.styleEditor.showRaw();
        await janggi.stylesSheet.styleEditor.setRaw("{");
        await janggi.stylesSheet.closeStyles();
      });

      then("they are told so in Korean", async ({janggi}) => {
        expect(await janggi.stylesSheet.styleEditor.getRawMessage()).toContain("JSON으로 읽을 수 없습니다");
      });
    });
  });

  when("they start making a set of pieces", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.openTheSettings();
      await janggi.settings.selectTab("Look");
      await janggi.stylesSheet.openStyles();
      await janggi.stylesSheet.styleStarter.start("Pieces", "Hangul");
      await janggi.stylesSheet.closeStyles();
    });

    then("its controls are in Korean, with each piece by its own name", async ({janggi}) => {
      const words = await janggi.stylesSheet.getWords();

      expect(words).toContain("몸체");
      expect(words).toContain("외곽선");
      expect(words).toContain("글꼴");
      expect(words).toContain("차");
      expect(words).not.toContain("Outline");
      expect(words).not.toContain("chariot");
      expect(words).not.toContain("Whole set");
    });

    then("what the controls change is the army, in Korean", async ({janggi}) => {
      expect(await janggi.stylesSheet.styleEditor.preview.getTarget()).toBe("초");
    });

    when("they load one army's pieces from another set", () => {
      beforeEach(async ({janggi}) => {
        await janggi.settings.openTheSettings();
        await janggi.settings.selectTab("Look");
        await janggi.stylesSheet.openStyles();
        await janggi.stylesSheet.styleEditor.tools.loadFrom("Modern", "cho");
        await janggi.stylesSheet.closeStyles();
      });

      then("they are told in Korean what was loaded, with the set under its own name", async ({janggi}) => {
        const message = await janggi.stylesSheet.styleEditor.getMessage();

        expect(message).toContain("Modern");
        expect(message).toContain("초 말을 불러왔습니다");
      });
    });

    when("they draw with a file that is not an SVG", () => {
      beforeEach(async ({janggi}) => {
        await janggi.settings.openTheSettings();
        await janggi.settings.selectTab("Look");
        await janggi.stylesSheet.openStyles();
        await janggi.stylesSheet.styleEditor.controls.chooseOption("glyph-kind-pictograph");
        await janggi.stylesSheet.styleEditor.controls.importDrawing("chariot", "not a drawing");
        await janggi.stylesSheet.closeStyles();
      });

      then("they are told so in Korean, beside the piece it was for", async ({janggi}) => {
        expect(await janggi.stylesSheet.styleEditor.controls.getDrawingMessage("chariot")).toContain(
          "SVG 파일이 아닙니다",
        );
      });
    });
  });
});
