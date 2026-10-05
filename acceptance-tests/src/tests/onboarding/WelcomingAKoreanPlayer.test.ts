import {
  beforeEach,
  expect,
  given,
  then,
  useFreshPlayer,
  useKoreanBrowser,
  when,
} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * Janggi is a Korean game, and a player whose browser prefers Korean should be welcomed and shown around in
 * it without having to find a setting first. The words are checked here as written, which is the point:
 * a Korean player who cannot read English is told what the game is, how it begins, and what each step of the
 * tour wants of them.
 */
given("a player whose browser prefers Korean opens the game for the first time", () => {
  useFreshPlayer();
  useKoreanBrowser();

  when("the game has loaded", () => {
    then("they are welcomed in Korean", async ({janggi}) => {
      expect(await janggi.onboarding.getWelcomeText()).toContain("장기에 오신 것을 환영합니다");
    });

    then("the page says it is in Korean", async ({janggi}) => {
      expect(await janggi.getPageLanguage()).toBe("ko");
    });

    then("they are told that the Korean is a work in progress", async ({janggi}) => {
      expect(await janggi.languageNotice.isShown()).toBe(true);
    });
  });

  when("they go on to set it up their way", () => {
    beforeEach(async ({janggi}) => {
      await janggi.onboarding.continueTheWelcome();
    });

    then("the choices are put to them in Korean", async ({janggi}) => {
      const welcome = await janggi.onboarding.getWelcomeText();

      expect(welcome).toContain("취향에 맞게 설정");
      expect(welcome).toContain("음악");
    });

    when("they start the tour", () => {
      beforeEach(async ({janggi}) => {
        await janggi.onboarding.startTheTour();
      });

      then("its first step is told in Korean", async ({janggi}) => {
        expect(await janggi.onboarding.getTourTitle()).toBe("말 집기");
        expect(await janggi.onboarding.getTourText()).toBe("내 말을 눌러 갈 수 있는 곳을 확인하세요.");
      });
    });
  });
});
