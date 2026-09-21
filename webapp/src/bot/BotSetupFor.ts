import type {BotElo} from "@janggi/shared/janggi/settings/BotElo";
import type {Engine} from "@src/bot/engine/types/Engine";
import type {GameState} from "@src/game/types/GameState";
import {SETUP_SEARCH_MS} from "@src/bot/levels/SetupSearchTime";
import type {Setup} from "@src/game/setups/types/Setup";
import type {SetupQuestion} from "@src/bot/types/SetupQuestion";
import type {SetupRating} from "@src/bot/setups/types/SetupRating";
import {TOURNAMENT_SETUPS} from "@src/bot/setups/TournamentSetups";
import {candidateTurnsFor} from "@src/bot/choice/CandidateTurnsFor";
import {fenOf} from "@src/bot/notation/FenOf";
import {nearBestSetup} from "@src/bot/setups/NearBestSetup";
import {newGame} from "@src/game/NewGame";
import {uciOfTurn} from "@src/bot/notation/UciOfTurn";

/** The engine, and what every opening it rates for one layout is searched under. */
interface Rater {
  readonly engine: Engine;
  readonly elo: BotElo;
  /** Checked before each search, so a layout nobody is waiting for any more asks for none of the rest. */
  readonly signal: AbortSignal;
}

/**
 * The setup the bot lays out in a scored game — chosen by asking the engine, never rolled blind.
 *
 * Every opening is rated the one way the engine can rate a position: a search of it, with Cho to move,
 * whose evaluation is from Cho's side. See `docs/bot.md` §2.
 *
 * **Laying out Cho**, Han's layout is on the board, so each of the four answers to it is rated and the
 * best for Cho is laid out. That is the privilege Han's 덤 pays for, and the bot takes it.
 *
 * **Laying out Han**, there is nothing yet to answer, so each Han setup is rated by its worst case: all
 * four Cho answers to it are searched, and the setup whose best answer does Han least harm is laid out.
 *
 * Either way the pick is among those rated near the best (`nearBestSetup`), not always the top one.
 * Searches run one after another and `signal` is checked before each, so a game dealt part-way through
 * sixteen of them stops the rest being asked.
 */
export async function botSetupFor(engine: Engine, {side, hanSetup, elo, roll, signal}: SetupQuestion): Promise<Setup> {
  const rater: Rater = {engine, elo, signal};

  if (side === "han") return nearBestSetup(await worstCasesForHan(rater), roll);

  if (!hanSetup) throw new Error("Cho lays out only once Han has, and the bot was asked to answer nothing");

  return nearBestSetup(await answersTo(hanSetup, rater), roll);
}

/** Each Han setup, rated from Han's side by the Cho answer that does it the most harm. */
async function worstCasesForHan(rater: Rater): Promise<SetupRating[]> {
  const ratings: SetupRating[] = [];

  for (const han of TOURNAMENT_SETUPS) {
    const answers = await answersTo(han, rater);
    if (answers.length === 0) continue;

    ratings.push({setup: han, score: -Math.max(...answers.map(({score}) => score))});
  }

  return ratings;
}

/** Each Cho setup, rated from Cho's side as an answer to `hanSetup`. An opening given no score is left out. */
async function answersTo(hanSetup: Setup, rater: Rater): Promise<SetupRating[]> {
  const ratings: SetupRating[] = [];

  for (const cho of TOURNAMENT_SETUPS) {
    const score = await choEvaluationOf(newGame(hanSetup, cho, "Scored"), rater);
    if (score === undefined) continue;

    ratings.push({setup: cho, score});
  }

  return ratings;
}

/** The engine's score for an opening, from Cho's side, Cho being the army to move in it. */
async function choEvaluationOf(opening: GameState, {engine, elo, signal}: Rater): Promise<number | undefined> {
  signal.throwIfAborted();

  const searchResult = await engine.search({
    fen: fenOf(opening),
    moves: [],
    searchMoves: candidateTurnsFor(opening, undefined).map(turn => uciOfTurn(opening, turn)),
    elo,
    moveTimeMs: SETUP_SEARCH_MS,
  });

  return searchResult.evaluation;
}
