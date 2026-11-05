import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

const GUIDE_ALTERNATES = {
  en: "https://janggi.neilarmstrong.dev/learn.html",
  ko: "https://janggi.neilarmstrong.dev/ko/learn.html",
  "x-default": "https://janggi.neilarmstrong.dev/learn.html",
};

/**
 * Someone searching in Korean for how to play janggi should find a guide they can read. It is a machine
 * translation, and says so before anything else, because it has not been read by a native speaker.
 */
given("someone searches in Korean for how to play janggi", () => {
  when("they open the Korean guide", () => {
    beforeEach(async ({janggi}) => {
      await janggi.guide.visitKoreanGuide();
    });

    then("the page describes the guide in Korean", async ({janggi}) => {
      expect(await janggi.getPageLanguage()).toBe("ko");
      expect(await janggi.guide.getPageTitle()).toBe("장기 두는 법 · 규칙과 말의 움직임 · 무료 장기 게임");
      expect(await janggi.discovery.getPageDescription()).toBe(
        "장기판과 일곱 종류의 말, 궁성과 포의 규칙, 빅장과 한수쉼까지. 장기 두는 법을 처음부터 쉽게 배우고 무료로 대국해 보세요.",
      );
      expect(await janggi.guide.getMainHeading()).toBe("장기 두는 법");
    });

    then("it says it was machine translated, in Korean and in English, before anything else", async ({janggi}) => {
      const notice = await janggi.guide.getTranslationNotice();

      expect(notice).toContain("기계 번역");
      expect(notice).toContain("machine translated");
    });

    then("the notice leads to the English guide it was translated from", async ({janggi}) => {
      expect(await janggi.guide.getEnglishGuideAddress()).toBe("/learn.html");
    });

    then("it explains the game in Korean from the objective through its distinctive rules", async ({janggi}) => {
      expect(await janggi.guide.getSectionHeadings()).toEqual([
        "장기란 무엇인가요?",
        "이기는 방법",
        "말의 움직임",
        "장기만의 규칙",
        "일반 장기와 점수제 장기",
        "장기 자주 묻는 질문",
      ]);

      const content = await janggi.guide.getContent();
      expect(content).toContain("외통");
      expect(content).toContain("빅장");
      expect(content).toContain("9 × 10");
      expect(content).toContain("Fairy-Stockfish");
    });

    then("search engines are given its own address, not the English guide's", async ({janggi}) => {
      expect(await janggi.guide.getCanonicalAddress()).toBe("https://janggi.neilarmstrong.dev/ko/learn.html");
    });

    then("search engines are told it is the Korean twin of the English guide", async ({janggi}) => {
      expect(await janggi.discovery.getLanguageAlternates()).toEqual(GUIDE_ALTERNATES);
    });

    then("search engines understand that it is written in Korean", async ({janggi}) => {
      expect(await janggi.discovery.getSearchDataLanguage()).toBe("ko");
    });

    then("it is shared with a card that is written in Korean", async ({janggi}) => {
      expect(await janggi.discovery.getSocialImageAddress()).toBe(
        "https://janggi.neilarmstrong.dev/social-card-ko.png",
      );
    });

    then("search engines that don't run scripts read it, and its notice, in Korean too", async ({janggi}) => {
      expect(await janggi.discovery.getMainHeadingServedToSearchEngines()).toBe("장기 두는 법");
      expect(await janggi.discovery.getTextServedToSearchEngines()).toContain("기계 번역");
    });

    then("search engines that follow links can reach the English guide from it", async ({janggi}) => {
      expect(await janggi.discovery.getOtherLanguageAddressInPageServedToSearchEngines()).toBe("/learn.html");
    });

    then("it leads straight back to the game in Korean", async ({janggi}) => {
      expect(await janggi.guide.isPlayLinkForTheGame()).toBe(true);
      expect(await janggi.guide.getPlayLinkAddress()).toBe("/ko/");
    });

    then("it links the rules research and Fairy-Stockfish project it relies on", async ({janggi}) => {
      expect(await janggi.guide.areGuideSourcesLinked()).toBe(true);
    });

    then("a language switch names each language in itself and marks Korean as the one it is in", async ({janggi}) => {
      expect(await janggi.guide.languageSwitch.getNames()).toEqual({en: "English", ko: "한국어"});
      expect(await janggi.guide.languageSwitch.getSelection()).toBe("ko");
    });

    then("the switch's words cannot be selected by accident", async ({janggi}) => {
      expect(await janggi.guide.languageSwitch.isTextSelectable()).toBe(false);
    });

    when("they press 한국어, the language it is already on", () => {
      beforeEach(async ({janggi}) => {
        await janggi.guide.languageSwitch.press("ko");
      });

      then("the switch toggles them to the other language's guide", async ({janggi}) => {
        expect(await janggi.guide.getCanonicalAddress()).toBe("https://janggi.neilarmstrong.dev/learn.html");
        expect(await janggi.getPageLanguage()).toBe("en");
        expect(await janggi.guide.languageSwitch.getSelection()).toBe("en");
      });
    });

    when("they switch to English", () => {
      beforeEach(async ({janggi}) => {
        await janggi.guide.languageSwitch.switchTo("en");
      });

      then("they are on the English guide, and the switch marks English", async ({janggi}) => {
        expect(await janggi.guide.getCanonicalAddress()).toBe("https://janggi.neilarmstrong.dev/learn.html");
        expect(await janggi.getPageLanguage()).toBe("en");
        expect(await janggi.guide.languageSwitch.getSelection()).toBe("en");
      });
    });
  });

  when("they open a piece's movement example in the Korean guide", () => {
    beforeEach(async ({janggi}) => {
      await janggi.guide.visitKoreanGuide();
      await janggi.guide.openPiece("horse");
    });

    then("a small board shows each place the piece can move, as in the English guide", async ({janggi}) => {
      expect(await janggi.guide.isPieceOpen("horse")).toBe(true);
      expect(await janggi.guide.getMovementDestinationCount("horse")).toBe(8);
    });

    then("what it says of the piece is in Korean", async ({janggi}) => {
      expect(await janggi.guide.getPieceName("horse")).toBe("마(馬)");
    });
  });

  when("they open the English guide", () => {
    beforeEach(async ({janggi}) => {
      await janggi.guide.visitGuide();
    });

    then("search engines are told it has a Korean twin", async ({janggi}) => {
      expect(await janggi.discovery.getLanguageAlternates()).toEqual(GUIDE_ALTERNATES);
    });

    then("search engines that follow links can reach the Korean guide from it", async ({janggi}) => {
      expect(await janggi.discovery.getOtherLanguageAddressInPageServedToSearchEngines()).toBe("/ko/learn.html");
    });

    then("it does not carry the machine translation notice", async ({janggi}) => {
      expect(await janggi.guide.getTranslationNotice()).toBe("");
    });

    then("the sitemap tells the same story as the pages", async ({janggi}) => {
      expect(await janggi.discovery.getSitemapLanguageAlternatesOfTheKoreanGuide()).toEqual(GUIDE_ALTERNATES);
    });

    then("a language switch marks English as the one it is in", async ({janggi}) => {
      expect(await janggi.guide.languageSwitch.getSelection()).toBe("en");
    });

    then("the switch's words cannot be selected by accident", async ({janggi}) => {
      expect(await janggi.guide.languageSwitch.isTextSelectable()).toBe(false);
    });

    when("they press English, the language it is already on", () => {
      beforeEach(async ({janggi}) => {
        await janggi.guide.languageSwitch.press("en");
      });

      then("the switch toggles them to the other language's guide", async ({janggi}) => {
        expect(await janggi.guide.getCanonicalAddress()).toBe("https://janggi.neilarmstrong.dev/ko/learn.html");
        expect(await janggi.getPageLanguage()).toBe("ko");
        expect(await janggi.guide.languageSwitch.getSelection()).toBe("ko");
      });
    });

    when("they switch to Korean", () => {
      beforeEach(async ({janggi}) => {
        await janggi.guide.languageSwitch.switchTo("ko");
      });

      then("they are on the Korean guide, and the switch marks Korean", async ({janggi}) => {
        expect(await janggi.guide.getCanonicalAddress()).toBe("https://janggi.neilarmstrong.dev/ko/learn.html");
        expect(await janggi.getPageLanguage()).toBe("ko");
        expect(await janggi.guide.languageSwitch.getSelection()).toBe("ko");
      });
    });
  });
});
