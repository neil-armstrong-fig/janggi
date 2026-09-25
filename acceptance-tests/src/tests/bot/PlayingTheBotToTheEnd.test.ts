import type {Janggi} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";
import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";
import {saveKeyWith} from "@src/shared/share-keys/SaveKeyWith";

/**
 * A whole game against the bot, played to its end.
 *
 * Every other bot spec stops after a turn or two, which proves the bot answers and nothing about a
 * game. A game played out is far deeper than a spec could script, so the player's moves are chosen by
 * the strongest bot, on another device: that device plays the same game from the other side of the
 * board against the strongest bot, and every turn either bot takes is played on the other device by
 * hand — a move tapped out, a turn rested, a bikjang called. The app's own rules referee both boards,
 * so the two stay one game.
 *
 * Only the ending is asserted, and what it shows. Who wins is not: the engine is not deterministic, and
 * its Elo is nominal (`docs/bot.md` §3). **The player starts with no XP**, since the fixture opens every
 * spec with a million and a player with everything unlocked has no bar to see on the result.
 */
given("a player with no XP takes on the weakest bot, playing what the strongest bot chooses on another device", () => {
  beforeEach.withAnotherDevice(async ({janggi, anotherDevice}) => {
    await janggi.settings.progress.loadSave(saveKeyWith({xp: 0}));
    await janggi.settings.opponent.setTo("Bot");
    await janggi.settings.botStrength.setTo(800);

    await anotherDevice.settings.opponent.setTo("Bot");
    await anotherDevice.settings.botStrength.setTo(2850);
    await anotherDevice.settings.yourSide.setTo("Han");
  });

  when("every turn either bot takes is played on the other device, until the game ends", () => {
    beforeEach.withAnotherDevice(async ({janggi, anotherDevice}) => {
      await playOut(janggi, anotherDevice);
    });

    then("the result is announced", async ({janggi}) => {
      expect(await janggi.status.isResultAnnounced()).toBe(true);
    });

    then("it shows the same XP bar the progress settings do", async ({janggi}) => {
      const shown = await janggi.status.getResultXpBarPercent();

      expect(shown).toBeDefined();
      expect(shown).toBe(await janggi.settings.progress.getXpBarPercent());
    });

    then("a game against the next strength up is offered only if the player won, which opened it", async ({janggi}) => {
      const won = (await janggi.status.getWinner()) === "cho";

      expect(await janggi.status.isNewGameAtNextStrengthOffered()).toBe(won);
    });
  });
});

/**
 * The other device's bot is let open as cho, and from then on each bot's turn is played on the device
 * it is not on, until the player's game has a result or `MOST_TURNS` have gone.
 */
async function playOut(janggi: Janggi, anotherDevice: Janggi): Promise<void> {
  await anotherDevice.status.letTheBotStart();
  await anotherDevice.status.waitForTheBot();

  for (let turn = 0; turn < MOST_TURNS; turn += 1) {
    if (await janggi.status.isResultAnnounced()) return;

    const [played, answering] = turn % 2 === 0 ? [anotherDevice, janggi] : [janggi, anotherDevice];
    await playTheBotsTurn(played, answering);
  }
}

/**
 * Plays on `answering` whatever the bot just did on `played`, then waits for `answering`'s own bot.
 *
 * A move leaves its two points marked. A rested turn and a called bikjang leave nothing marked, and of
 * those only the bikjang ends a casual game drawn.
 */
async function playTheBotsTurn(played: Janggi, answering: Janggi): Promise<void> {
  const move = await played.board.getLastMove();

  if (move) {
    await answering.board.tap(move.from.file, move.from.rank);
    await answering.board.tap(move.to.file, move.to.rank);
  } else if (await played.status.isDrawn()) {
    await answering.status.callBikjang();
  } else {
    await answering.status.pass();
  }

  await answering.status.waitForTheBot();
}

/** Far past any game these two play, so a relay that has stopped moving the game on ends rather than spinning. */
const MOST_TURNS = 400;
