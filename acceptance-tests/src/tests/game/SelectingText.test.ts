import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("a player at the game", () => {
  when("the page has loaded", () => {
    then("the game's own words cannot be selected, as in a game rather than a website", async ({janggi}) => {
      expect(await janggi.status.isTurnLineSelectable()).toBe(false);
    });

    then("a save key can still be selected to copy", async ({janggi}) => {
      expect(await janggi.settings.you.progress.isSaveKeySelectable()).toBe(true);
    });
  });

  when("a clocked game is reloaded mid-turn", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.play.clock.setTo("5 min");
      await janggi.board.tap(1, 7);
      await janggi.board.tap(1, 6);
      await janggi.reload();
    });

    then("the resume dialog's words cannot be selected either", async ({janggi}) => {
      expect(await janggi.resumeGame.isTextSelectable()).toBe(false);
    });
  });
});
