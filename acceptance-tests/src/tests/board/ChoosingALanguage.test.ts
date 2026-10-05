import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * Janggi is a Korean game, and a player who reads little English should be able to play it. The game
 * is read in English until another language is chosen, and a choice is kept: the tabs, the controls under
 * the board and the page's own declared language all follow it.
 */
given("a player opens the game", () => {
  when("nothing has been chosen", () => {
    then("it is read in English", async ({janggi}) => {
      expect(await janggi.settings.language.getSelected()).toBe("en");
      expect(await janggi.getPageLanguage()).toBe("en");
      expect(await janggi.settings.getTabLabel("Play")).toBe("Play");
      expect(await janggi.status.getControlLabel("pass")).toBe("Pass");
    });

    then("nothing is said about a translation", async ({janggi}) => {
      expect(await janggi.languageNotice.isShown()).toBe(false);
    });
  });

  when("they choose Korean", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.language.setTo("ko");
    });

    then("the page says it is in Korean", async ({janggi}) => {
      expect(await janggi.settings.language.getSelected()).toBe("ko");
      expect(await janggi.getPageLanguage()).toBe("ko");
    });

    then("the address is the game's Korean page", async ({janggi}) => {
      expect(await janggi.getAddressPath()).toBe("/ko/");
    });

    then("they are told, in Korean and in English, that the Korean is a work in progress", async ({janggi}) => {
      const words = await janggi.languageNotice.getWords();

      expect(await janggi.languageNotice.isShown()).toBe(true);
      expect(words).toContain("한국어 번역은 아직 작업 중입니다");
      expect(words).toContain("The Korean translation is a work in progress");
    });

    when("they have read it", () => {
      beforeEach(async ({janggi}) => {
        await janggi.languageNotice.dismissIt();
      });

      then("it is put away, and Korean stays", async ({janggi}) => {
        expect(await janggi.languageNotice.isShown()).toBe(false);
        expect(await janggi.getPageLanguage()).toBe("ko");
      });

      when("they come back later", () => {
        beforeEach(async ({janggi}) => {
          await janggi.reload();
        });

        then("it stays away", async ({janggi}) => {
          expect(await janggi.languageNotice.isShown()).toBe(false);
        });
      });

      when("they choose English and then Korean again", () => {
        beforeEach(async ({janggi}) => {
          await janggi.settings.language.setTo("en");
          await janggi.settings.language.setTo("ko");
        });

        then("they are told again, having chosen it again", async ({janggi}) => {
          expect(await janggi.languageNotice.isShown()).toBe(true);
        });
      });
    });

    then("the settings tabs are named in Korean", async ({janggi}) => {
      expect(await janggi.settings.getTabLabel("Play")).toBe("게임");
      expect(await janggi.settings.getTabLabel("Look")).toBe("화면");
      expect(await janggi.settings.getTabLabel("Sound")).toBe("소리");
      expect(await janggi.settings.getTabLabel("You")).toBe("내 정보");
    });

    then("the controls under the board are named in Korean", async ({janggi}) => {
      expect(await janggi.status.getControlLabel("pass")).toBe("한수쉼");
      expect(await janggi.status.getControlLabel("bikjang")).toBe("빅장");
      expect(await janggi.status.getControlLabel("draw")).toBe("무승부");
      expect(await janggi.status.getControlLabel("undo")).toBe("무르기");
      expect(await janggi.status.getControlLabel("redo")).toBe("다시");
      expect(await janggi.status.getControlLabel("settings")).toBe("설정");
    });
  });

  when("they choose Korean and look at the game's own settings", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.language.setTo("ko");
    });

    then("who plays the other army is named in Korean", async ({janggi}) => {
      expect(await janggi.settings.opponent.getOptionLabel("Human")).toBe("사람");
      expect(await janggi.settings.opponent.getOptionLabel("Bot")).toBe("봇");
    });

    then("the two games are named in Korean", async ({janggi}) => {
      expect(await janggi.settings.matchFormat.getOptionLabel("Casual")).toBe("일반");
      expect(await janggi.settings.matchFormat.getOptionLabel("Scored")).toBe("점수제");
    });

    then("starting again is named in Korean", async ({janggi}) => {
      expect(await janggi.settings.getNewGameLabel()).toBe("새 게임");
    });
  });

  when("they choose Korean and look at how the game looks and sounds", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.language.setTo("ko");
    });

    then("what is marked on the board is put in Korean", async ({janggi}) => {
      expect(await janggi.settings.movableHighlight.getLabel()).toBe("움직일 수 있는 말 표시");
    });

    then("the sound settings are put in Korean", async ({janggi}) => {
      expect(await janggi.settings.music.getMuteLabel()).toBe("음악 끄기");
    });
  });

  when("they choose Korean and look at their record", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.language.setTo("ko");
    });

    then("the record is named in Korean, and so is clearing it", async ({janggi}) => {
      expect(await janggi.recordSheet.getOpenerLabel()).toBe("내 기록");
      expect(await janggi.recordSheet.getResetLabel()).toBe("기록 초기화");
    });
  });

  when("they choose Korean and play", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.language.setTo("ko");
      await janggi.languageNotice.dismissIt();
    });

    then("the armies are called 초 and 한 on their plaques", async ({janggi}) => {
      expect(await janggi.status.getArmyName("cho")).toBe("초");
      expect(await janggi.status.getArmyName("han")).toBe("한");
    });

    when("cho offers a draw", () => {
      beforeEach(async ({janggi}) => {
        await janggi.status.offerDraw();
      });

      then("the offer is put in Korean", async ({janggi}) => {
        expect(await janggi.status.getDrawOfferLine()).toBe("무승부 · 초 제안");
      });
    });
  });

  when("they choose Korean and come back later", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.language.setTo("ko");
      await janggi.reload();
    });

    then("it is still read in Korean", async ({janggi}) => {
      expect(await janggi.settings.language.getSelected()).toBe("ko");
      expect(await janggi.status.getControlLabel("pass")).toBe("한수쉼");
    });
  });

  when("they choose Korean and then English again", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.language.setTo("ko");
      await janggi.settings.language.setTo("en");
    });

    then("it is read in English", async ({janggi}) => {
      expect(await janggi.getPageLanguage()).toBe("en");
      expect(await janggi.status.getControlLabel("pass")).toBe("Pass");
    });

    then("the address is the game's English page", async ({janggi}) => {
      expect(await janggi.getAddressPath()).toBe("/");
    });

    when("they come back later", () => {
      beforeEach(async ({janggi}) => {
        await janggi.reload();
      });

      then("it is still read in English", async ({janggi}) => {
        expect(await janggi.getPageLanguage()).toBe("en");
      });
    });
  });

  when("they open the Korean page and choose English", () => {
    beforeEach(async ({janggi}) => {
      await janggi.visitKoreanGame();
      await janggi.settings.language.setTo("en");
    });

    then("it is read in English at the English page's address", async ({janggi}) => {
      expect(await janggi.getPageLanguage()).toBe("en");
      expect(await janggi.getAddressPath()).toBe("/");
    });

    when("they come back later", () => {
      beforeEach(async ({janggi}) => {
        await janggi.reload();
      });

      then("it is still read in English", async ({janggi}) => {
        expect(await janggi.getPageLanguage()).toBe("en");
      });
    });
  });
});
