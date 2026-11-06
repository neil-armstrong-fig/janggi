import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * The tutorial is for a player who does not yet know the game, so a Korean player has to be able to follow it without
 * English: what each step asks, and the card's own buttons. The words are checked here as written, which is the point.
 */
given("a player who reads the game in Korean", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.you.language.setTo("ko");
    await janggi.languageNotice.dismissIt();
  });

  when("they start the tutorial", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.you.startTheTutorial();
    });

    then("the card tells them what to do in Korean", async ({janggi}) => {
      expect(await janggi.tutorial.getWords()).toContain("졸이 앞으로 나갑니다");
    });

    then("the card's own buttons are in Korean", async ({janggi}) => {
      const words = await janggi.tutorial.getWords();

      expect(words).toContain("튜토리얼 나가기");
      expect(words).not.toContain("Leave the tutorial");
    });
  });
});
