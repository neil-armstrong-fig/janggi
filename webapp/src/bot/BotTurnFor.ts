import type {BotDecision} from "@src/bot/types/BotDecision";
import type {BotTurn} from "@src/bot/types/BotTurn";
import type {Engine} from "@src/bot/engine/types/Engine";
import {MOVE_TIMES_MS} from "@src/bot/levels/MoveTimes";
import type {TurnQuestion} from "@src/bot/types/TurnQuestion";
import {candidateTurnsFor} from "@src/bot/choice/CandidateTurnsFor";
import {historyFor} from "@src/bot/notation/HistoryFor";
import {shouldCallBikjang} from "@src/bot/choice/ShouldCallBikjang";
import {uciOfTurn} from "@src/bot/notation/UciOfTurn";

/**
 * The bot's whole turn: what it plays in the position the record stands at.
 *
 * **Our engine referees and Fairy-Stockfish advises** (`docs/bot.md`). A bikjang worth calling is
 * called here, before the engine is asked anything, because a call is not a move it knows. Otherwise
 * the engine chooses — but only from `candidateTurnsFor`, and its answer is matched against that list
 * exactly as offered. An answer that is not on it, or no answer at all, is not trusted: the bot plays
 * the first candidate instead, which is legal by construction.
 *
 * Asked only while the game is undecided and it is the bot's army to move; the caller knows both.
 */
export async function botTurnFor(engine: Engine, {played, elo, evaluation}: TurnQuestion): Promise<BotDecision> {
  const state = played.present;
  if (shouldCallBikjang(state, evaluation)) return {turn: CALL_BIKJANG, evaluation};

  const candidates = candidateTurnsFor(state, evaluation);
  const offered = candidates.map(turn => uciOfTurn(state, turn));

  const result = await engine.search({
    ...historyFor(played),
    searchMoves: offered,
    elo,
    moveTimeMs: MOVE_TIMES_MS[elo],
  });

  const turn = candidates[offered.indexOf(result.bestMove)] ?? candidates[0];
  if (!turn) throw new Error("The bot was asked to play in a position with nothing to play");

  return {turn, evaluation: result.evaluation ?? evaluation};
}

const CALL_BIKJANG: BotTurn = {kind: "callBikjang"};
