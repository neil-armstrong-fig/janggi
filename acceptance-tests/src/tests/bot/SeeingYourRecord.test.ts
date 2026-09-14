import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * The player's rating and record against the bot, kept on the device and apart for each format.
 *
 * A game played out to a result is far deeper than a spec can tap, so the result that is reachable
 * stands in for all of them: a game **abandoned** before it ends — by starting another over it — is a
 * loss, rated and recorded exactly as a lost game would be. How a won or drawn game moves the rating is
 * unit tested beneath the page.
 *
 * Leaving the page is not abandoning the game. The game is kept on the device, so it is waiting when
 * the player comes back, and it is still theirs to win or lose.
 */
given("a player who has never played the bot", () => {
  when("they look at their record", () => {
    then("they stand at 1200 in casual play", async ({janggi}) => {
      expect(await janggi.recordSheet.getElo("Casual")).toBe(1200);
    });

    then("they stand at 1200 in scored play", async ({janggi}) => {
      expect(await janggi.recordSheet.getElo("Scored")).toBe(1200);
    });

    then("the game stays where it is beneath the record, rather than being left", async ({janggi}) => {
      expect(await janggi.recordSheet.isGameStillBeneath()).toBe(true);
    });
  });

  when("they start a new game in the middle of a casual one against the bot", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.opponent.setTo("Bot");
      await janggi.settings.botStrength.setTo(1200);
      await janggi.board.tap(1, 7);
      await janggi.board.tap(1, 6);
      await janggi.status.waitForTheBot();
      await janggi.settings.startNewGame();
    });

    then("the game is recorded as a loss against that bot", async ({janggi}) => {
      expect(await janggi.recordSheet.getGamesAgainst("Casual", 1200)).toEqual({played: 1, won: 0, drawn: 0, lost: 1});
    });

    then("their casual rating has fallen", async ({janggi}) => {
      expect(await janggi.recordSheet.getElo("Casual")).toBeLessThan(1200);
    });

    then("their scored rating is untouched, the two formats being rated apart", async ({janggi}) => {
      expect(await janggi.recordSheet.getElo("Scored")).toBe(1200);
    });

    when("they reset their record", () => {
      beforeEach(async ({janggi}) => {
        await janggi.recordSheet.resetRecord();
      });

      then("their casual rating is back at 1200", async ({janggi}) => {
        expect(await janggi.recordSheet.getElo("Casual")).toBe(1200);
      });

      then("the loss is gone from their record", async ({janggi}) => {
        expect(await janggi.recordSheet.getGamesAgainst("Casual", 1200)).toEqual({
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
        });
      });

      when("they come back to the game later", () => {
        beforeEach(async ({janggi}) => {
          await janggi.reload();
        });

        then("the record is still clear, the reset having been kept", async ({janggi}) => {
          expect(await janggi.recordSheet.getElo("Casual")).toBe(1200);
        });
      });
    });

    when("they come back to the game later", () => {
      beforeEach(async ({janggi}) => {
        await janggi.reload();
      });

      then("the loss is still on their record", async ({janggi}) => {
        expect(await janggi.recordSheet.getGamesAgainst("Casual", 1200)).toEqual({
          played: 1,
          won: 0,
          drawn: 0,
          lost: 1,
        });
      });
    });
  });

  when("they leave the page in the middle of a game against the bot and come back to it", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.opponent.setTo("Bot");
      await janggi.settings.botStrength.setTo(800);
      await janggi.board.tap(1, 7);
      await janggi.board.tap(1, 6);
      await janggi.status.waitForTheBot();
      await janggi.reload();
    });

    then("the game is waiting for them where they left it", async ({janggi}) => {
      expect(await janggi.board.getPieceAt(1, 6)).toEqual({side: "cho", type: "soldier"});
    });

    then("nothing is on their record yet, the game being still under way", async ({janggi}) => {
      expect(await janggi.recordSheet.getGamesAgainst("Casual", 800)).toEqual({played: 0, won: 0, drawn: 0, lost: 0});
    });

    when("they then start a new game over it", () => {
      beforeEach(async ({janggi}) => {
        await janggi.settings.startNewGame();
      });

      then("the game they abandoned is recorded as a loss", async ({janggi}) => {
        expect(await janggi.recordSheet.getGamesAgainst("Casual", 800)).toEqual({
          played: 1,
          won: 0,
          drawn: 0,
          lost: 1,
        });
      });
    });
  });
});
