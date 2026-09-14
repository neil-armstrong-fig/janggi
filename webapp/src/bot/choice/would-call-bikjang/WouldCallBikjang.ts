import type {GameState} from "@src/game/types/GameState";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {opponentOf} from "@src/game/utils/OpponentOf";
import {scoreFor} from "@src/game/scoring/ScoreFor";

/**
 * Whether an army would call a bikjang in this position if the rules let it — the one decision the
 * bot makes that Fairy-Stockfish cannot, because its janggi has no called bikjang (`docs/bot.md`).
 *
 * The two formats settle a call differently, so they want different things of it. **Casually** a call
 * is a draw, worth taking only by an army that is losing, which is what the engine's evaluation says —
 * centipawns from `side`'s point of view. **Scored**, a call decides the game on points there and then,
 * so an army ahead on `scoreFor` calls whatever the evaluation thinks of the position.
 *
 * Whether a bikjang is on the board and callable at all is `canCallBikjang`'s question, not this one.
 */
export function wouldCallBikjang(state: GameState, side: Side, evaluation: number | undefined): boolean {
  if (state.format === "Casual") return evaluation !== undefined && evaluation < -LOSING_BY;

  return scoreFor(state, side) > scoreFor(state, opponentOf(side));
}

/**
 * How far behind, in centipawns, before a draw is worth more than playing on — about a soldier. A
 * level position is still a game, so the margin keeps the bot from drawing one it could win.
 */
const LOSING_BY = 150;
