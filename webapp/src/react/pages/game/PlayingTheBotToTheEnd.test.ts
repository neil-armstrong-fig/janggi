import type {BotDuty} from "@src/react/pages/game/types/BotDuty";
import type {BotElo} from "@janggi/shared/janggi/settings/BotElo";
import type {Engine} from "@src/bot/engine/types/Engine";
import type {GameSliceState} from "@src/redux/game/types/GameSliceState";
import type {MatchFormat} from "@janggi/shared/janggi/settings/MatchFormat";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import type {SideChoiceName} from "@janggi/shared/janggi/settings/SideChoiceName";
import {botDutyFor} from "@src/react/pages/game/bot-duty/BotDutyFor";
import {botReplyFor} from "@src/react/pages/game/hooks/use-bot-opponent/utils/BotReplyFor";
import {botStrengthChosen, formatChosen, gameReducer, opponentChosen, sideChosen} from "@src/redux/game/GameSlice";
import {createNodeFairyStockfish} from "@src/testing/CreateNodeFairyStockfish";
import {expect, it} from "vitest";
import {firstGame} from "@src/redux/game/first-game/FirstGame";
import {opponentOf} from "@src/game/utils/OpponentOf";
import {outcomeOf} from "@src/game/OutcomeOf";

/** An army the game is waiting on, the strength it is played at, and what it is waited on for. */
interface Waiting {
  readonly side: Side;
  readonly elo: BotElo;
  readonly duty: BotDuty;
}

/**
 * Whole games against the bot, played to their end on the real Fairy-Stockfish.
 *
 * Everything else about the bot is tested a turn at a time against a fake `Engine`, which proves each
 * decision and nothing about a game: that a record forty turns deep still becomes a search the engine
 * accepts, that its answers keep matching what it was offered, and that a game the bot plays does come
 * to an end. Here the weakest bot is the opponent and the strongest plays the player's army, both
 * through what the page uses for the bot — `botDutyFor` says who is waited on, `botReplyFor` says what
 * they do, and the game's own reducer plays it.
 *
 * Only the ending is asserted. Who wins is not: the engine is not deterministic, and its Elo is
 * nominal (`docs/bot.md` §3).
 *
 * Every search is capped at `MOST_THINKING_MS`, so a game takes seconds rather than minutes. The cap
 * weakens both bots alike and changes nothing about what they may play. Even so, `pnpm test` leaves
 * this out: it runs through `pnpm test:bot-games`, in a workflow of its own (`vitest.config.ts`).
 */

// Above the engine rather than beside the helpers: it is built as this file loads, before anything
// declared further down exists.
const WEAKEST: BotElo = 800;
const STRONGEST: BotElo = 2850;
const MOST_THINKING_MS = 100;

/** Far past any game these two have played — they end inside fifty turns — so reaching it means one was not ending. */
const MOST_TURNS = 400;

const A_GAME_WITHIN_MS = 120_000;

const engine = cappedAt(MOST_THINKING_MS, createNodeFairyStockfish());

it("plays a casual game against the bot as cho through to its end", {timeout: A_GAME_WITHIN_MS}, async () => {
  const game = await playedOut(dealt("Casual", "Cho"));

  expect(outcomeOf(game.played.present).kind).not.toBe("undecided");
});

it(
  "lays out and plays a scored game against the bot as han through to its end",
  {timeout: A_GAME_WITHIN_MS},
  async () => {
    const game = await playedOut(dealt("Scored", "Han"));

    expect(outcomeOf(game.played.present).kind).not.toBe("undecided");
  },
);

/** A fresh game against the weakest bot, dealt through the same settings a player chooses. */
function dealt(format: MatchFormat, side: SideChoiceName): GameSliceState {
  return [formatChosen(format), opponentChosen("Bot"), botStrengthChosen(WEAKEST), sideChosen(side)].reduce(
    gameReducer,
    firstGame(),
  );
}

/**
 * Plays turns until the game has an outcome or `MOST_TURNS` have gone, carrying each army's last
 * evaluation into its next turn as the page does for the bot.
 */
async function playedOut(dealtGame: GameSliceState): Promise<GameSliceState> {
  let game = dealtGame;
  const evaluations: Record<Side, number | undefined> = {cho: undefined, han: undefined};

  for (let turn = 0; turn < MOST_TURNS && outcomeOf(game.played.present).kind === "undecided"; turn += 1) {
    const {side, elo, duty} = waitedOn(game);
    const reply = await botReplyFor(engine, {
      duty,
      played: game.played,
      elo,
      evaluation: evaluations[side],
      signal: new AbortController().signal,
    });

    evaluations[side] = reply.evaluation;
    game = gameReducer(game, reply.action);
  }

  return game;
}

/**
 * Whichever army the game is waiting on. The bot's is asked exactly as the page asks; the player's is
 * asked the same way, of the game as it would stand with the armies' players swapped.
 */
function waitedOn({played, phase, opponent}: GameSliceState): Waiting {
  const botSide = opponentOf(opponent.playerSide);

  const bot = botDutyFor(played, phase, opponent);
  if (bot) return {side: botSide, elo: opponent.botElo, duty: bot};

  const player = botDutyFor(played, phase, {...opponent, playerSide: botSide});
  if (player) return {side: opponent.playerSide, elo: STRONGEST, duty: player};

  throw new Error("The game is waiting on neither army, and has no outcome either");
}

/** The engine, never let think for longer than `most` milliseconds over a move. */
function cappedAt(most: number, capped: Engine): Engine {
  return {
    prepare: () => capped.prepare(),
    search: search => capped.search({...search, moveTimeMs: Math.min(search.moveTimeMs, most)}),
    stop: () => {
      capped.stop();
    },
  };
}
