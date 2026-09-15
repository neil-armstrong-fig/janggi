import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * Playing against the bot. The bot is Fairy-Stockfish, run in the page, and asked only ever for a
 * move the app's own rules would accept — `docs/bot.md`. What a spec can see of it is that it
 * answers: the turn comes back, and in a scored game it lays its army out in the order the rules
 * give. How well it plays is nothing a spec can assert, which is why every game here is at the
 * bottom rung.
 *
 * A game against the bot is rated, so nothing in one can be taken back — and it is under way from its
 * first move, after which the settings lock and walking away counts as a loss. So where the bot is
 * cho and the first move is its own, it holds that move until the player lets it start: choosing a
 * side is not the same thing as starting a game.
 *
 * Each army's plaque says who is playing it, so the bot is never mistaken for a second person, and
 * each carries a rating — the bot's strength and the player's own Elo.
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

    then("han is marked as the bot's army, with the strength it plays at", async ({janggi}) => {
      expect(await janggi.status.isMarkedAsTheBot("han")).toBe(true);
      expect(await janggi.status.getShownRating("han")).toBe(800);
    });

    then("cho is marked as the player's army, with their own rating", async ({janggi}) => {
      expect(await janggi.status.isMarkedAsThePlayer("cho")).toBe(true);
      expect(await janggi.status.getShownRating("cho")).toBe(await janggi.recordSheet.getElo("Casual"));
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
    });

    then("the bot holds cho's first move until it is let start", async ({janggi}) => {
      expect(await janggi.status.isWaitingToLetTheBotStart()).toBe(true);
      expect(await janggi.status.getTurn()).toBe("cho");
    });

    then("nothing is settled yet, so the side and the opponent may still be changed", async ({janggi}) => {
      expect(await janggi.settings.yourSide.isChoosable()).toBe(true);
      expect(await janggi.settings.opponent.isChoosable()).toBe(true);
    });

    then("the plaques swap, marking cho as the bot's army and han as the player's", async ({janggi}) => {
      expect(await janggi.status.isMarkedAsTheBot("cho")).toBe(true);
      expect(await janggi.status.isMarkedAsThePlayer("han")).toBe(true);
    });

    when("they leave the bot as long as it would take to open", () => {
      beforeEach(async ({janggi}) => {
        await janggi.status.giveTheBotTimeToOpen();
      });

      then("cho's first move is still unplayed, and their side may still be changed", async ({janggi}) => {
        expect(await janggi.status.getTurn()).toBe("cho");
        expect(await janggi.settings.yourSide.isChoosable()).toBe(true);
      });
    });

    when("they let the bot start", () => {
      beforeEach(async ({janggi}) => {
        await janggi.status.letTheBotStart();
        await janggi.status.waitForTheBot();
      });

      then("the bot opens as cho, leaving han to move", async ({janggi}) => {
        expect(await janggi.status.getTurn()).toBe("han");
      });

      then("nothing is held waiting any more", async ({janggi}) => {
        expect(await janggi.status.isWaitingToLetTheBotStart()).toBe(false);
      });

      then("the opponent is settled for the rest of the game", async ({janggi}) => {
        expect(await janggi.settings.opponent.isChoosable()).toBe(false);
      });
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

    then("the bot answers the layout, then holds cho's first move until it is let start", async ({janggi}) => {
      expect(await janggi.status.isLayingOut()).toBe(false);
      expect(await janggi.status.isWaitingToLetTheBotStart()).toBe(true);
    });

    when("they let the bot start", () => {
      beforeEach(async ({janggi}) => {
        await janggi.status.letTheBotStart();
        await janggi.status.waitForTheBot();
      });

      then("the bot makes cho's first move, leaving han to move", async ({janggi}) => {
        expect(await janggi.status.getTurn()).toBe("han");
      });
    });
  });
});

given("two people play at one device", () => {
  when("nobody has played anything yet", () => {
    then("neither army is marked as anybody's, and neither shows a rating", async ({janggi}) => {
      expect(await janggi.status.isMarkedAsTheBot("han")).toBe(false);
      expect(await janggi.status.isMarkedAsThePlayer("cho")).toBe(false);
      expect(await janggi.status.getShownRating("cho")).toBeUndefined();
      expect(await janggi.status.getShownRating("han")).toBeUndefined();
    });

    then("nothing waits to be let start", async ({janggi}) => {
      expect(await janggi.status.isWaitingToLetTheBotStart()).toBe(false);
    });
  });
});
