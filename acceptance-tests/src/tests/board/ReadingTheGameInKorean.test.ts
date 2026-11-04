import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * What a player meets around the board in Korean beyond the controls: what the two match formats mean, what a piece is
 * called to a screen reader, and what the next unlock opens, where a style keeps its proper name and the words around
 * it are Korean.
 */
given("a player who reads the game in Korean", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.language.setTo("ko");
    await janggi.languageNotice.dismissIt();
  });

  when("they ask what the match formats mean", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.matchFormat.toggleExplanation();
    });

    then("the answer is in Korean", async ({janggi}) => {
      const words = await janggi.settings.matchFormat.getExplanationWords();

      expect(words).toContain("대한장기협회의 대회 방식입니다");
      expect(words).not.toContain("tournament game");
    });
  });

  when("a screen reader reads a piece on the board", () => {
    then("it is named in Korean", async ({janggi}) => {
      expect(await janggi.board.getPieceLabelAt(5, 9)).toBe("초 궁");
    });
  });

  when("they have earned nothing yet and are playing the bot", () => {
    beforeEach(async ({janggi}) => {
      await janggi.resizeWindowTo(1024, 900);
      await janggi.debug.setProgress({xp: 0, beaten: {}});
      await janggi.settings.opponent.setTo("Bot");
    });

    then("the settings name the next unlock in Korean, keeping the style's own name", async ({janggi}) => {
      expect(await janggi.settings.progress.getNextUnlockWords()).toBe("다음 해금, 30 XP: Hanja 말");
    });

    then("the plaque says the same in Korean", async ({janggi}) => {
      await expect.poll(() => janggi.status.getNextUnlock("cho")).toBe("(다음 해금: 30 XP, Hanja 말)");
    });
  });
});
