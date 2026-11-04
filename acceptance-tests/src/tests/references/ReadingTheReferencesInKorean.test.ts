import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

const REFERENCES_ALTERNATES = {
  en: "https://janggi.neilarmstrong.dev/references.html",
  ko: "https://janggi.neilarmstrong.dev/ko/references.html",
  "x-default": "https://janggi.neilarmstrong.dev/references.html",
};

/**
 * Someone reading janggi in Korean should be able to read where its rules came from. Like the guide it is a machine
 * translation and says so before anything else, and what other people wrote keeps the name they gave it.
 */
given("someone who reads Korean wants to know where the rules came from", () => {
  when("they open the Korean references", () => {
    beforeEach(async ({janggi}) => {
      await janggi.references.visitKoreanReferences();
    });

    then("the page describes the references in Korean", async ({janggi}) => {
      expect(await janggi.getPageLanguage()).toBe("ko");
      expect(await janggi.references.getPageTitle()).toBe("장기 규칙 출처 · 참고 자료와 크레딧");
      expect(await janggi.getPageDescription()).toBe(
        "장기 규칙과 상차림 연구의 출처, 봇에 쓰인 Fairy-Stockfish, 이 무료 장기 게임을 만드는 데 쓰인 오픈 소스 소프트웨어를 소개합니다.",
      );
      expect(await janggi.references.getMainHeading()).toBe("참고 자료 및 출처");
    });

    then("it says it was machine translated, in Korean and in English, before anything else", async ({janggi}) => {
      const notice = await janggi.references.getTranslationNotice();

      expect(notice).toContain("기계 번역");
      expect(notice).toContain("machine translated");
    });

    then("the notice leads to the English references it was translated from", async ({janggi}) => {
      expect(await janggi.references.getOriginalAddress()).toBe("/references.html");
    });

    then("its sections are headed in Korean", async ({janggi}) => {
      expect(await janggi.references.getHeadings()).toEqual([
        "규칙과 대국 방식",
        "상차림과 변형 규칙",
        "컴퓨터 상대",
        "오픈 소스 소프트웨어와 도구",
      ]);
    });

    then("what each source contributed is explained in Korean", async ({janggi}) => {
      const content = await janggi.references.getContent();

      expect(content).toContain("빅장");
      expect(content).toContain("모든 수를 자체 규칙으로 확인");
      expect(content).not.toContain("In Korean");
      expect(content).not.toContain("checks every move");
    });

    then("what other people wrote keeps the name they gave it", async ({janggi}) => {
      const content = await janggi.references.getContent();

      expect(content).toContain("대한장기협회 · Korea Janggi Association");
      expect(content).toContain("장하영 · Jang Ha-young");
      expect(content).toContain("Fairy-Stockfish");
      expect(content).toContain("PyChess Variants contributors");
    });

    then("the labels this project wrote are in Korean", async ({janggi}) => {
      const content = await janggi.references.getContent();

      expect(content).toContain("이 게임의 규칙 해석");
      expect(content).not.toContain("How this app interprets the rules");
    });

    then("each source leads where it does on the English page", async ({janggi}) => {
      expect(await janggi.references.getDestinationOf("reference-kja")).toBe(
        "http://www.kja.or.kr/business/business5.php",
      );
      expect(await janggi.references.getDestinationOf("reference-fairy-wasm")).toBe(
        "https://github.com/fairy-stockfish/fairy-stockfish.wasm",
      );
    });

    then("the files shipped with the engine are found from one folder down", async ({janggi}) => {
      expect(await janggi.references.getDestinationOf("reference-engine-licence")).toBe("/engine/Copying.txt");
    });

    then("search engines are given its own address, not the English page's", async ({janggi}) => {
      expect(await janggi.getCanonicalAddress()).toBe("https://janggi.neilarmstrong.dev/ko/references.html");
    });

    then("search engines are told it is the Korean twin of the English page", async ({janggi}) => {
      expect(await janggi.getLanguageAlternates()).toEqual(REFERENCES_ALTERNATES);
    });

    then("search engines understand that it is written in Korean", async ({janggi}) => {
      expect(await janggi.getSearchDataLanguage()).toBe("ko");
    });

    then("it is shared with a card that is written in Korean", async ({janggi}) => {
      expect(await janggi.getSocialImageAddress()).toBe("https://janggi.neilarmstrong.dev/social-card-ko.png");
    });

    then("search engines that don't run scripts read it, and its notice, in Korean too", async ({janggi}) => {
      expect(await janggi.getMainHeadingServedToSearchEngines()).toBe("참고 자료 및 출처");
      expect(await janggi.getTextServedToSearchEngines()).toContain("기계 번역");
    });

    then("search engines that follow links can reach the English page from it", async ({janggi}) => {
      expect(await janggi.getOtherLanguageAddressInPageServedToSearchEngines()).toBe("/references.html");
    });

    then("a language switch names each language in itself and marks Korean as the one it is in", async ({janggi}) => {
      expect(await janggi.references.languageSwitch.getNames()).toEqual({en: "English", ko: "한국어"});
      expect(await janggi.references.languageSwitch.getSelection()).toBe("ko");
    });

    then("the language switch sits at the top right of the page, as the guide's does", async ({janggi}) => {
      expect(await janggi.references.isLanguageSwitchAtTheTopRight()).toBe(true);
    });

    then("the switch's words cannot be selected by accident", async ({janggi}) => {
      expect(await janggi.references.languageSwitch.isTextSelectable()).toBe(false);
    });

    when("they press 한국어, the language it is already on", () => {
      beforeEach(async ({janggi}) => {
        await janggi.references.languageSwitch.press("ko");
      });

      then("the switch toggles them to the other language's references", async ({janggi}) => {
        expect(await janggi.getCanonicalAddress()).toBe("https://janggi.neilarmstrong.dev/references.html");
        expect(await janggi.getPageLanguage()).toBe("en");
        expect(await janggi.references.languageSwitch.getSelection()).toBe("en");
      });
    });

    when("they switch to English", () => {
      beforeEach(async ({janggi}) => {
        await janggi.references.languageSwitch.switchTo("en");
      });

      then("they are on the English references, and the switch marks English", async ({janggi}) => {
        expect(await janggi.getCanonicalAddress()).toBe("https://janggi.neilarmstrong.dev/references.html");
        expect(await janggi.getPageLanguage()).toBe("en");
        expect(await janggi.references.languageSwitch.getSelection()).toBe("en");
      });
    });
  });

  when("they open the English references", () => {
    beforeEach(async ({janggi}) => {
      await janggi.references.visitReferences();
    });

    then("search engines are told it has a Korean twin", async ({janggi}) => {
      expect(await janggi.getLanguageAlternates()).toEqual(REFERENCES_ALTERNATES);
    });

    then("search engines that follow links can reach the Korean page from it", async ({janggi}) => {
      expect(await janggi.getOtherLanguageAddressInPageServedToSearchEngines()).toBe("/ko/references.html");
    });

    then("it does not carry the machine translation notice", async ({janggi}) => {
      expect(await janggi.references.getTranslationNotice()).toBe("");
    });

    then("the sitemap tells the same story as the pages", async ({janggi}) => {
      expect(await janggi.getSitemapLanguageAlternatesOfTheKoreanReferences()).toEqual(REFERENCES_ALTERNATES);
    });

    then("a language switch marks English as the one it is in", async ({janggi}) => {
      expect(await janggi.references.languageSwitch.getSelection()).toBe("en");
    });

    then("the language switch sits at the top right of the page, as the guide's does", async ({janggi}) => {
      expect(await janggi.references.isLanguageSwitchAtTheTopRight()).toBe(true);
    });

    then("the switch's words cannot be selected by accident", async ({janggi}) => {
      expect(await janggi.references.languageSwitch.isTextSelectable()).toBe(false);
    });

    when("they press English, the language it is already on", () => {
      beforeEach(async ({janggi}) => {
        await janggi.references.languageSwitch.press("en");
      });

      then("the switch toggles them to the other language's references", async ({janggi}) => {
        expect(await janggi.getCanonicalAddress()).toBe("https://janggi.neilarmstrong.dev/ko/references.html");
        expect(await janggi.getPageLanguage()).toBe("ko");
        expect(await janggi.references.languageSwitch.getSelection()).toBe("ko");
      });
    });

    when("they switch to Korean", () => {
      beforeEach(async ({janggi}) => {
        await janggi.references.languageSwitch.switchTo("ko");
      });

      then("they are on the Korean references, and the switch marks Korean", async ({janggi}) => {
        expect(await janggi.getCanonicalAddress()).toBe("https://janggi.neilarmstrong.dev/ko/references.html");
        expect(await janggi.getPageLanguage()).toBe("ko");
        expect(await janggi.references.languageSwitch.getSelection()).toBe("ko");
      });
    });
  });

  when("they find it from the Korean guide", () => {
    beforeEach(async ({janggi}) => {
      await janggi.guide.visitKoreanGuide();
    });

    then("the guide links to the Korean references", async ({janggi}) => {
      expect(await janggi.guide.getReferencesAddress()).toBe("/ko/references.html");
    });
  });

  when("they find it from the Korean game's page", () => {
    beforeEach(async ({janggi}) => {
      await janggi.visitKoreanGame();
    });

    then("the page served to search engines links to the Korean references", async ({janggi}) => {
      expect(await janggi.getReferencesAddressInPageServedToSearchEngines()).toBe("/ko/references.html");
    });
  });
});

given("a player who reads the game in Korean", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.language.setTo("ko");
    await janggi.languageNotice.dismissIt();
  });

  when("they look at the link to the references in the settings", () => {
    then("it leads to the Korean references", async ({janggi}) => {
      expect(await janggi.settings.getReferencesAddressInGame()).toBe("/ko/references.html");
    });
  });

  when("they open the references from the settings", () => {
    beforeEach(async ({janggi}) => {
      await janggi.references.openReferences();
    });

    then("the page opens separately, in Korean", async ({janggi}) => {
      expect(await janggi.references.isSeparateFromGame()).toBe(true);
      expect(await janggi.references.getMainHeading()).toBe("참고 자료 및 출처");
    });
  });
});

given("a player who reads the game in English", () => {
  when("they look at the link to the references in the settings", () => {
    then("it leads to the English references", async ({janggi}) => {
      expect(await janggi.settings.getReferencesAddressInGame()).toBe("/references.html");
    });
  });
});
