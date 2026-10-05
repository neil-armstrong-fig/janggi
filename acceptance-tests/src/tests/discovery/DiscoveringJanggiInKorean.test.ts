import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

const LANGUAGE_ALTERNATES = {
  en: "https://janggi.neilarmstrong.dev/",
  ko: "https://janggi.neilarmstrong.dev/ko/",
  "x-default": "https://janggi.neilarmstrong.dev/",
};

/**
 * Someone searching in Korean should find the game read in Korean. Only the game has a Korean page: the
 * guide, references and legal pages are English, so the Korean page links to them as English.
 */
given("someone searches in Korean for a way to play janggi", () => {
  when("they open the game's Korean page", () => {
    beforeEach(async ({janggi}) => {
      await janggi.visitKoreanGame();
    });

    then("the page describes a free janggi game in Korean", async ({janggi}) => {
      expect(await janggi.getPageLanguage()).toBe("ko");
      expect(await janggi.getPageTitle()).toBe("장기 온라인 무료 게임 · 친구 또는 AI와 대국");
      expect(await janggi.getPageDescription()).toBe(
        "친구와 비밀 코드로 온라인 장기를 두거나 8단계 AI와 대국하세요. 설치하면 오프라인에서도 즐길 수 있습니다. 무료이며, AI 대국은 계정이 필요 없습니다.",
      );
      expect(await janggi.getMainHeading()).toBe("장기 온라인 게임");
    });

    then("search engines are given its own address, not the English page's", async ({janggi}) => {
      expect(await janggi.getCanonicalAddress()).toBe("https://janggi.neilarmstrong.dev/ko/");
    });

    then("search engines are told it is the Korean twin of the English page", async ({janggi}) => {
      expect(await janggi.getLanguageAlternates()).toEqual(LANGUAGE_ALTERNATES);
    });

    then("search engines understand that it is written in Korean", async ({janggi}) => {
      expect(await janggi.getSearchDataLanguage()).toBe("ko");
      expect(await janggi.getSearchDataName()).toBe("장기");
    });

    then("it is shared with a card that is written in Korean", async ({janggi}) => {
      expect(await janggi.getSocialImageAddress()).toBe("https://janggi.neilarmstrong.dev/social-card-ko.png");
    });

    then("it is read in Korean with nothing chosen first", async ({janggi}) => {
      expect(await janggi.settings.language.getSelected()).toBe("ko");
      expect(await janggi.status.getControlLabel("pass")).toBe("한수쉼");
    });

    then("search engines that don't run scripts read it in Korean too", async ({janggi}) => {
      expect(await janggi.getMainHeadingServedToSearchEngines()).toBe("장기 온라인 게임");
      expect(await janggi.getTextServedToSearchEngines()).toContain("비밀 코드");
    });

    then("the guide it links to is the English one, and says so", async ({janggi}) => {
      expect(await janggi.getGuideAddressInPageServedToSearchEngines()).toBe("/learn.html");
      expect(await janggi.getTextServedToSearchEngines()).toContain("(English)");
    });
  });

  when("they open the game's English page", () => {
    then("search engines are told it has a Korean twin", async ({janggi}) => {
      expect(await janggi.getLanguageAlternates()).toEqual(LANGUAGE_ALTERNATES);
    });

    then("the sitemap tells the same story as the pages", async ({janggi}) => {
      expect(await janggi.getSitemapLanguageAlternatesOfTheKoreanGame()).toEqual(LANGUAGE_ALTERNATES);
    });
  });
});
