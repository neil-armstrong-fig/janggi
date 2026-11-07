import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * Korean may break a line between any two letters, and a browser left to itself does, so a word is cut in two at the end of
 * a line (가져오/거나). That reads as a mistake to a Korean reader. Lines break between words, as the guide's always have.
 */
given("a player who reads the game in Korean on a narrow phone", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.you.language.setTo("ko");
    await janggi.languageNotice.dismissIt();
    await janggi.resizeWindowTo(320, 568);
  });

  when("they read their styles", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.openTheSettings();
      await janggi.settings.selectTab("Look");
      await janggi.stylesSheet.openStyles();
    });

    then("no line ends in the middle of a word", async ({janggi}) => {
      expect(await janggi.getKoreanWordsSplitAcrossLines()).toEqual([]);
    });
  });

  when("they read the settings", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.openTheSettings();
    });

    then("no line ends in the middle of a word", async ({janggi}) => {
      expect(await janggi.getKoreanWordsSplitAcrossLines()).toEqual([]);
    });
  });
});

given("someone who reads the Korean guide on a narrow phone", () => {
  beforeEach(async ({janggi}) => {
    await janggi.resizeWindowTo(320, 568);
    await janggi.guide.visitKoreanGuide();
  });

  when("the page has loaded", () => {
    then("no line ends in the middle of a word", async ({janggi}) => {
      expect(await janggi.getKoreanWordsSplitAcrossLines()).toEqual([]);
    });
  });
});

given("someone who reads the Korean references on a narrow phone", () => {
  beforeEach(async ({janggi}) => {
    await janggi.resizeWindowTo(320, 568);
    await janggi.references.visitKoreanReferences();
  });

  when("the page has loaded", () => {
    then("no line ends in the middle of a word", async ({janggi}) => {
      expect(await janggi.getKoreanWordsSplitAcrossLines()).toEqual([]);
    });

    then("it fits the window", async ({janggi}) => {
      expect(await janggi.references.isFullyOnScreen()).toBe(true);
    });
  });
});
