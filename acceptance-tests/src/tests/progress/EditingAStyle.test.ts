import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";
import {saveKeyWith} from "@src/shared/share-keys/SaveKeyWith";

/**
 * The style editor is the style, drawn and turned by hand: a board on screen wearing the style as it
 * stands, and a control for each thing about it, every one held to what a board can draw. The raw JSON is
 * still there, as a second view of the same style — see `MakingAStyle.test.ts` for what is made from it.
 *
 * Classic's lines are `#4a3116`, ink on pale wood, and its stroke is 1.25 wide.
 */
const CLASSIC_INK = "rgb(74, 49, 22)";

given("a player with the XP to make a style", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.progress.loadSave(saveKeyWith({xp: 300}));
  });

  when("they start a board from the classic one", () => {
    beforeEach(async ({janggi}) => {
      await janggi.stylesSheet.styleStarter.start("Board", "Classic");
    });

    then("the preview draws the lines as classic does", async ({janggi}) => {
      expect(await janggi.stylesSheet.styleEditor.preview.getLineColourAt(5, 5)).toBe(CLASSIC_INK);
    });

    then("it shows every piece on the board", async ({janggi}) => {
      expect(await janggi.stylesSheet.styleEditor.preview.getPieceCount()).toBe(32);
    });

    then("the colour control shows the colour of the lines", async ({janggi}) => {
      expect(await janggi.stylesSheet.styleEditor.controls.getColour("line-colour")).toBe("#4a3116");
    });

    when("they pick another colour for the lines", () => {
      beforeEach(async ({janggi}) => {
        await janggi.stylesSheet.styleEditor.controls.setColour("line-colour", "#ff0000");
      });

      then("the preview draws its lines in it, at once", async ({janggi}) => {
        expect(await janggi.stylesSheet.styleEditor.preview.getLineColourAt(5, 5)).toBe("rgb(255, 0, 0)");
      });

      then("the game's own board is not touched until it is saved", async ({janggi}) => {
        expect(await janggi.board.getLineColourAt(5, 5)).toBe(CLASSIC_INK);
      });

      when("they save it", () => {
        beforeEach(async ({janggi}) => {
          await janggi.stylesSheet.styleEditor.save("Red lines");
        });

        then("it is saved", async ({janggi}) => {
          expect(await janggi.stylesSheet.styleEditor.isRefused()).toBe(false);
          expect(await janggi.stylesSheet.ownStyles.getNames("Board")).toEqual(["Red lines"]);
        });

        then("the game's board is wearing it", async ({janggi}) => {
          expect(await janggi.board.getLineColourAt(5, 5)).toBe("rgb(255, 0, 0)");
        });
      });
    });

    when("they save it without giving it a name", () => {
      beforeEach(async ({janggi}) => {
        await janggi.stylesSheet.styleEditor.save("");
      });

      then("they are asked for one, and nothing is saved", async ({janggi}) => {
        expect(await janggi.stylesSheet.styleEditor.isRefused()).toBe(true);
        expect(await janggi.stylesSheet.ownStyles.getNames("Board")).toEqual([]);
      });
    });

    when("they type a line thicker than a line can be drawn", () => {
      beforeEach(async ({janggi}) => {
        await janggi.stylesSheet.styleEditor.controls.setNumber("line-width", 99);
      });

      then("it stops at the thickest there is", async ({janggi}) => {
        expect(await janggi.stylesSheet.styleEditor.controls.getNumber("line-width")).toBe(10);
        expect(await janggi.stylesSheet.styleEditor.preview.getLineWidthAt(5, 5)).toBe(10);
      });
    });

    when("they pick a colour for the bikjang line", () => {
      beforeEach(async ({janggi}) => {
        await janggi.stylesSheet.styleEditor.controls.setColour("bikjang-colour", "#ff00ff");
        await janggi.stylesSheet.styleEditor.save("Pink bikjang");
      });

      when("the generals come to face each other and cho calls the bikjang", () => {
        beforeEach(async ({janggi}) => {
          await janggi.board.tap(5, 7);
          await janggi.board.tap(4, 7);
          await janggi.board.tap(5, 4);
          await janggi.board.tap(4, 4);
          await janggi.status.callBikjang();
        });

        then("the line between them is drawn in it", async ({janggi}) => {
          expect(await janggi.board.getBikjangLineColour()).toBe("rgb(255, 0, 255)");
        });
      });
    });

    when("they look at the style as raw JSON", () => {
      beforeEach(async ({janggi}) => {
        await janggi.stylesSheet.styleEditor.showRaw();
      });

      then("it is the same style, written out", async ({janggi}) => {
        expect(await janggi.stylesSheet.styleEditor.getRaw()).toContain("#4a3116");
      });

      then("there is room to read it", async ({janggi}) => {
        expect(await janggi.stylesSheet.styleEditor.getRawLinesShown()).toBe(14);
      });

      when("the window is as small as a small phone's", () => {
        beforeEach(async ({janggi}) => {
          await janggi.resizeWindowTo(320, 568);
        });

        then("there is still room to read it, the editor scrolling to reach it", async ({janggi}) => {
          expect(await janggi.stylesSheet.styleEditor.getRawLinesShown()).toBe(14);
        });
      });

      when("they change the colour of the lines there", () => {
        beforeEach(async ({janggi}) => {
          const raw = await janggi.stylesSheet.styleEditor.getRaw();
          await janggi.stylesSheet.styleEditor.setRaw(raw.replace("#4a3116", "#0000ff"));
        });

        then("the preview follows", async ({janggi}) => {
          expect(await janggi.stylesSheet.styleEditor.preview.getLineColourAt(5, 5)).toBe("rgb(0, 0, 255)");
        });

        when("they go back to the controls", () => {
          beforeEach(async ({janggi}) => {
            await janggi.stylesSheet.styleEditor.showControls();
          });

          then("the control shows it too", async ({janggi}) => {
            expect(await janggi.stylesSheet.styleEditor.controls.getColour("line-colour")).toBe("#0000ff");
          });
        });
      });

      when("they type JSON that will not do", () => {
        beforeEach(async ({janggi}) => {
          await janggi.stylesSheet.styleEditor.setRaw("{");
        });

        then("they are told what is wrong", async ({janggi}) => {
          expect(await janggi.stylesSheet.styleEditor.isRawRefused()).toBe(true);
        });

        then("the preview keeps the last style that did", async ({janggi}) => {
          expect(await janggi.stylesSheet.styleEditor.preview.getLineColourAt(5, 5)).toBe(CLASSIC_INK);
        });
      });
    });
  });

  when("they start a piece set from the hangul one", () => {
    beforeEach(async ({janggi}) => {
      await janggi.stylesSheet.styleStarter.start("Pieces", "Hangul");
    });

    then("the preview shows every piece on the board", async ({janggi}) => {
      expect(await janggi.stylesSheet.styleEditor.preview.getPieceCount()).toBe(32);
    });

    then("the controls are changing cho's pieces", async ({janggi}) => {
      expect(await janggi.stylesSheet.styleEditor.preview.getTarget()).toBe("Cho");
    });

    when("they make the pieces smaller", () => {
      let choBefore: number | undefined;
      let hanBefore: number | undefined;

      beforeEach(async ({janggi}) => {
        choBefore = await janggi.stylesSheet.styleEditor.preview.getPieceWidthAt(1, 10);
        hanBefore = await janggi.stylesSheet.styleEditor.preview.getPieceWidthAt(1, 1);

        await janggi.stylesSheet.styleEditor.controls.setNumber("piece-size", 0.5);
      });

      then("cho's pieces shrink on the preview", async ({janggi}) => {
        expect(await janggi.stylesSheet.styleEditor.preview.getPieceWidthAt(1, 10)).toBeLessThan(choBefore ?? 0);
      });

      then("han's do not", async ({janggi}) => {
        expect(await janggi.stylesSheet.styleEditor.preview.getPieceWidthAt(1, 1)).toBe(hanBefore);
      });
    });

    when("they tap one piece and make only that one smaller", () => {
      let generalBefore: number | undefined;
      let chariotBefore: number | undefined;

      beforeEach(async ({janggi}) => {
        generalBefore = await janggi.stylesSheet.styleEditor.preview.getPieceWidthAt(5, 9);
        chariotBefore = await janggi.stylesSheet.styleEditor.preview.getPieceWidthAt(1, 10);

        await janggi.stylesSheet.styleEditor.preview.tap(5, 9);
        await janggi.stylesSheet.styleEditor.controls.setNumber("piece-size", 0.5);
      });

      then("the controls say which piece they are changing", async ({janggi}) => {
        expect(await janggi.stylesSheet.styleEditor.preview.getTarget()).toBe("Cho general");
      });

      then("that piece shrinks", async ({janggi}) => {
        expect(await janggi.stylesSheet.styleEditor.preview.getPieceWidthAt(5, 9)).toBeLessThan(generalBefore ?? 0);
      });

      then("its own army's other pieces do not", async ({janggi}) => {
        expect(await janggi.stylesSheet.styleEditor.preview.getPieceWidthAt(1, 10)).toBe(chariotBefore);
      });

      when("they take that back", () => {
        beforeEach(async ({janggi}) => {
          await janggi.stylesSheet.styleEditor.preview.resetTarget();
        });

        then("the piece is as big as the rest of its army again", async ({janggi}) => {
          // To the pixel: two columns of the grid come out a fraction of one apart.
          expect(await janggi.stylesSheet.styleEditor.preview.getPieceWidthAt(5, 9)).toBeCloseTo(chariotBefore ?? 0, 0);
        });
      });
    });

    when("they make cho's pieces smaller", () => {
      beforeEach(async ({janggi}) => {
        await janggi.stylesSheet.styleEditor.controls.setNumber("piece-size", 0.5);
      });

      then("the general, which the set draws a size of its own, shrinks with the rest", async ({janggi}) => {
        const chariot = await janggi.stylesSheet.styleEditor.preview.getPieceWidthAt(1, 10);

        expect(await janggi.stylesSheet.styleEditor.preview.getPieceWidthAt(5, 9)).toBeCloseTo(chariot ?? 0, 0);
      });
    });

    when("they save the set they changed", () => {
      beforeEach(async ({janggi}) => {
        await janggi.stylesSheet.styleEditor.controls.setNumber("piece-size", 0.5);
        await janggi.stylesSheet.styleEditor.save("Small pieces");
      });

      then("the game's pieces are wearing it", async ({janggi}) => {
        expect(await janggi.settings.pieceSet.getSelectedName()).toBe("Small pieces");
      });
    });
  });
});

given("a player with the XP to make a style, and the hanja set to start from", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.progress.loadSave(saveKeyWith({xp: 300}));
    await janggi.stylesSheet.styleStarter.start("Pieces", "Hanja");
  });

  then("cho's pieces are written in hanja, the general too", async ({janggi}) => {
    expect(await janggi.stylesSheet.styleEditor.preview.getCharacterAt(5, 9)).toBe("楚");
    expect(await janggi.stylesSheet.styleEditor.preview.getCharacterAt(1, 10)).toBe("車");
  });

  when("they change cho's writing to hangul", () => {
    beforeEach(async ({janggi}) => {
      await janggi.stylesSheet.styleEditor.controls.chooseOption("writing-Hangul");
    });

    then("every piece of cho's is in hangul, the general included", async ({janggi}) => {
      expect(await janggi.stylesSheet.styleEditor.preview.getCharacterAt(5, 9)).toBe("초");
      expect(await janggi.stylesSheet.styleEditor.preview.getCharacterAt(1, 10)).toBe("차");
    });

    then("han's are still in hanja", async ({janggi}) => {
      expect(await janggi.stylesSheet.styleEditor.preview.getCharacterAt(5, 2)).toBe("漢");
    });
  });

  when("they change cho's mark to drawings", () => {
    beforeEach(async ({janggi}) => {
      await janggi.stylesSheet.styleEditor.controls.chooseOption("glyph-kind-pictograph");
    });

    then("no piece of cho's is left carrying a character, the general included", async ({janggi}) => {
      expect(await janggi.stylesSheet.styleEditor.preview.getCharacterAt(5, 9)).toBeUndefined();
      expect(await janggi.stylesSheet.styleEditor.preview.getCharacterAt(1, 10)).toBeUndefined();
    });
  });

  when("they show the pieces on another board", () => {
    beforeEach(async ({janggi}) => {
      await janggi.stylesSheet.styleEditor.preview.showWith("Neon");
    });

    then("the preview draws that board's lines", async ({janggi}) => {
      expect(await janggi.stylesSheet.styleEditor.preview.getLineColourAt(5, 5)).toBe("rgb(47, 111, 143)");
    });

    then("the game's own board is not changed", async ({janggi}) => {
      expect(await janggi.board.getLineColourAt(5, 5)).toBe(CLASSIC_INK);
    });
  });
});

given("a player with the XP to make a style, and a board to start from", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.progress.loadSave(saveKeyWith({xp: 300}));
    await janggi.stylesSheet.styleStarter.start("Board", "Classic");
  });

  when("they show the board with another piece set", () => {
    beforeEach(async ({janggi}) => {
      await janggi.stylesSheet.styleEditor.preview.showWith("Hangul");
    });

    then("the preview's pieces are that set's", async ({janggi}) => {
      expect(await janggi.stylesSheet.styleEditor.preview.getCharacterAt(5, 9)).toBe("초");
    });

    then("the game's own pieces are not changed", async ({janggi}) => {
      expect(await janggi.board.getCharacterAt(5, 9)).not.toBe("초");
    });
  });
});

given("a player who has made a board of their own", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.progress.loadSave(saveKeyWith({xp: 300}));
    await janggi.stylesSheet.makeStyle("Board", "Classic", "Mine");
    await janggi.stylesSheet.styleStarter.start("Board", "Mine");
  });

  then("starting from it puts its name in the box", async ({janggi}) => {
    expect(await janggi.stylesSheet.styleEditor.getName()).toBe("Mine");
  });

  when("they change it and save it under the name it has", () => {
    beforeEach(async ({janggi}) => {
      await janggi.stylesSheet.styleEditor.controls.setColour("line-colour", "#ff0000");
      await janggi.stylesSheet.styleEditor.save();
    });

    then("it is changed, not made a second time", async ({janggi}) => {
      expect(await janggi.stylesSheet.ownStyles.getNames("Board")).toEqual(["Mine"]);
      expect(await janggi.board.getLineColourAt(5, 5)).toBe("rgb(255, 0, 0)");
    });
  });
});

given("a player who dresses han in hanja and cho in hangul, making a board", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.progress.loadSave(saveKeyWith({xp: 300}));
    await janggi.settings.pieceSet.setTo("Hangul");
    await janggi.settings.pieceSet.toggleChoosingApart();
    await janggi.settings.pieceSet.chooseForArmy("han", "Hanja");
    await janggi.stylesSheet.styleStarter.start("Board", "Classic");
  });

  then("the preview shows the pieces as they are worn, each army in its own set", async ({janggi}) => {
    expect(await janggi.stylesSheet.styleEditor.preview.getCharacterAt(5, 2)).toBe("漢");
    expect(await janggi.stylesSheet.styleEditor.preview.getCharacterAt(5, 9)).toBe("초");
  });
});
