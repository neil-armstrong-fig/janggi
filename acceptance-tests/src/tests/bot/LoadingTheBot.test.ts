import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * The bot's engine is Fairy-Stockfish, and it is fetched, compiled and given its threads in the page. On
 * a slow connection or a phone that takes seconds, and on a bad day it never comes at all — so the game
 * says which it is rather than saying the bot is thinking, and it does not let a rated game begin against
 * a bot that cannot answer.
 *
 * The engine starts loading the moment the bot is the opponent, so that it is usually ready before the
 * first move is made. Until it is, the board is closed and a notice over it says what is being waited for;
 * if it cannot be started the notice says so and offers to try again.
 */
given("a player takes on the bot while its engine is slow to load", () => {
  beforeEach(async ({janggi}) => {
    await janggi.reload();
    await janggi.holdBackTheBotsEngine();
    await janggi.settings.opponent.setTo("Bot");
    await janggi.settings.botStrength.setTo(800);
  });

  when("the engine has not arrived yet", () => {
    then("the game says the bot is loading, not thinking", async ({janggi}) => {
      expect(await janggi.status.isWaitingForTheBotToLoad()).toBe(true);
    });

    then("the player's pieces cannot be moved yet", async ({janggi}) => {
      expect(await janggi.board.canBeMoved(1, 7)).toBe(false);
    });
  });

  when("the engine arrives", () => {
    beforeEach(async ({janggi}) => {
      await janggi.restoreTheBotsEngine();
      await janggi.status.waitForTheBotToLoad();
    });

    then("the game stops saying the bot is loading", async ({janggi}) => {
      expect(await janggi.status.isWaitingForTheBotToLoad()).toBe(false);
    });

    then("the player's pieces can be moved", async ({janggi}) => {
      expect(await janggi.board.canBeMoved(1, 7)).toBe(true);
    });
  });

  when("the engine arrives and the player moves a soldier", () => {
    beforeEach(async ({janggi}) => {
      await janggi.restoreTheBotsEngine();
      await janggi.status.waitForTheBotToLoad();
      await janggi.board.tap(1, 7);
      await janggi.board.tap(1, 6);
      await janggi.status.waitForTheBot();
    });

    then("the bot answers, handing the move back to cho", async ({janggi}) => {
      expect(await janggi.status.getTurn()).toBe("cho");
    });
  });
});

given("a player takes on the bot while its engine cannot be fetched", () => {
  beforeEach(async ({janggi}) => {
    await janggi.reload();
    await janggi.cutOffTheBotsEngine();
    await janggi.settings.opponent.setTo("Bot");
    await janggi.settings.botStrength.setTo(800);
    await janggi.status.waitForTheBotToLoad();
  });

  when("the engine has failed to load", () => {
    then("the game says the bot is unavailable", async ({janggi}) => {
      expect(await janggi.status.isTheBotUnavailable()).toBe(true);
    });

    then("the player's pieces cannot be moved", async ({janggi}) => {
      expect(await janggi.board.canBeMoved(1, 7)).toBe(false);
    });
  });

  when("the engine can be fetched again and the player tries again", () => {
    beforeEach(async ({janggi}) => {
      await janggi.restoreTheBotsEngine();
      await janggi.status.retryTheBot();
      await janggi.status.waitForTheBotToLoad();
    });

    then("the bot is no longer unavailable", async ({janggi}) => {
      expect(await janggi.status.isTheBotUnavailable()).toBe(false);
    });

    then("the player's pieces can be moved", async ({janggi}) => {
      expect(await janggi.board.canBeMoved(1, 7)).toBe(true);
    });
  });
});
