import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * Playing against the bot. The bot is Fairy-Stockfish, run in the page, and asked only ever for a
 * move the app's own rules would accept — `docs/bot.md`. What a spec can see of it is that it
 * answers: the turn comes back, and in a scored game it lays its army out in the order the rules
 * give. How well it plays is nothing a spec can assert, which is why every game here is at the
 * bottom rung.
 *
 * A game against the bot is rated, so nothing in one can be taken back.
 */
given("a player takes on the bot", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.opponent.setTo("Bot");
    await janggi.settings.botStrength.setTo(800);
  });

  when("nobody has played anything yet", () => {
    then("the opponent may still be changed", async ({janggi}) => {
      expect(await janggi.settings.opponent.isChoosable()).toBe(true);
    });
  });

  when("they play cho and push a soldier forward", () => {
    beforeEach(async ({janggi}) => {
      await janggi.board.tap(1, 7);
      await janggi.board.tap(1, 6);
      await janggi.status.waitForTheBot();
    });

    then("the bot answers, handing the move back to cho", async ({janggi}) => {
      expect(await janggi.status.getTurn()).toBe("cho");
    });

    then("nothing can be taken back, a game against the bot being played out", async ({janggi}) => {
      expect(await janggi.status.canUndo()).toBe(false);
    });

    then("the opponent is settled for the rest of the game", async ({janggi}) => {
      expect(await janggi.settings.opponent.isChoosable()).toBe(false);
    });
  });

  when("they play han", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.yourSide.setTo("Han");
      await janggi.status.waitForTheBot();
    });

    then("the bot opens as cho, leaving han to move", async ({janggi}) => {
      expect(await janggi.status.getTurn()).toBe("han");
    });
  });
});

given("a player takes on the bot in a scored game", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.matchFormat.setTo("Scored");
    await janggi.settings.opponent.setTo("Bot");
    await janggi.settings.botStrength.setTo(800);
  });

  when("they play cho", () => {
    beforeEach(async ({janggi}) => {
      await janggi.status.waitForTheBot();
    });

    then("the bot lays out han first, leaving cho to answer", async ({janggi}) => {
      expect(await janggi.status.isLayingOut()).toBe(true);
      expect(await janggi.status.getTurn()).toBe("cho");
    });
  });

  when("they play han and lay out first", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.yourSide.setTo("Han");
      await janggi.settings.hanSetup.setTo("Inner Elephant");
      await janggi.status.waitForTheBot();
    });

    then("the bot answers the layout and makes cho's first move, leaving han to move", async ({janggi}) => {
      expect(await janggi.status.isLayingOut()).toBe(false);
      expect(await janggi.status.getTurn()).toBe("han");
    });
  });
});
