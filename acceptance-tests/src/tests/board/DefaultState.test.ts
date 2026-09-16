import {
  expect,
  given,
  then,
  useShippedOpponent,
  when,
} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

useShippedOpponent();

given("a user opens the game for the first time", () => {
  when("the page has loaded", () => {
    then("the board is visible", async ({janggi}) => {
      const visible = await janggi.board.isVisible();

      expect(visible).toBe(true);
    });

    then("modern pieces are in use", async ({janggi}) => {
      expect(await janggi.settings.pieceSet.getSelected()).toBe("Modern");
    });

    then("the opponent is the bot", async ({janggi}) => {
      expect(await janggi.settings.opponent.getSelected()).toBe("Bot");
    });
  });
});
