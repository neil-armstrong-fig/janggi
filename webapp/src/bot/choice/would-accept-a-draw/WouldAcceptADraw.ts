import type {GameState} from "@src/game/types/GameState";
import {canAgreeADraw} from "@src/game/drawing/CanAgreeADraw";
import {underThirtyPointsEach} from "@src/game/utils/UnderThirtyPointsEach";

/**
 * Whether the bot accepts a draw a player has offered it. Like a called bikjang it is a decision the
 * engine cannot make — Fairy-Stockfish has no offered draws — so it is ours, and it turns on what the
 * engine last made of the position: `evaluation` is centipawns from the bot's side, or undefined
 * before it has searched anything.
 *
 * **Only where there is nothing left to play for.** Each army under thirty points is the endgame the
 * rules let a position be repeated in, and so the only place a game can go round for ever. A draw
 * accepted from the opening would be a free half point against any bot, on demand, so it is taken
 * only here — a middlegame is still a game.
 *
 * And not when the bot is winning. A level game is worth the half point; a clearly better one is
 * worth playing on, and the margin is how far ahead that is — about a soldier, as
 * `wouldCallBikjang`'s is behind. With no evaluation there is no way to say, so it declines.
 *
 * Whether a draw may be agreed at all is `canAgreeADraw`'s question, asked here so a scored game,
 * which has no draw, is turned down rather than left to the engine to refuse.
 */
export function wouldAcceptADraw(state: GameState, evaluation: number | undefined): boolean {
  if (!canAgreeADraw(state) || !underThirtyPointsEach(state)) return false;

  return evaluation !== undefined && evaluation <= NOT_CLEARLY_WINNING;
}

/** How far ahead, in centipawns, before a draw is worth less than playing on — about a soldier. */
const NOT_CLEARLY_WINNING = 100;
