import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * A phone has no room for everything on one row, so the header keeps the name and the language switch together, and
 * gives the way into the game a row of its own, wide enough for a thumb.
 */
given("someone reads the guide on the narrowest phone", () => {
  beforeEach(async ({janggi}) => {
    await janggi.resizeWindowTo(320, 640);
  });

  when("they open it in English", () => {
    beforeEach(async ({janggi}) => {
      await janggi.guide.visitGuide();
    });

    then("the language switch is beside the title", async ({janggi}) => {
      expect(await janggi.guide.isLanguageSwitchBesideTheTitle()).toBe(true);
    });

    then("the button into the game fills the row below it", async ({janggi}) => {
      expect(await janggi.guide.isPlayButtonFullWidthBelowTheTitle()).toBe(true);
    });
  });

  when("they open it in Korean", () => {
    beforeEach(async ({janggi}) => {
      await janggi.guide.visitKoreanGuide();
    });

    then("the language switch is beside the title", async ({janggi}) => {
      expect(await janggi.guide.isLanguageSwitchBesideTheTitle()).toBe(true);
    });

    then("the button into the game fills the row below it", async ({janggi}) => {
      expect(await janggi.guide.isPlayButtonFullWidthBelowTheTitle()).toBe(true);
    });
  });
});

given("someone reads the guide on a wide screen", () => {
  beforeEach(async ({janggi}) => {
    await janggi.resizeWindowTo(1280, 800);
  });

  when("they open it", () => {
    beforeEach(async ({janggi}) => {
      await janggi.guide.visitGuide();
    });

    then("the button into the game stays beside the language switch", async ({janggi}) => {
      expect(await janggi.guide.isPlayButtonBesideTheLanguageSwitch()).toBe(true);
    });
  });
});
