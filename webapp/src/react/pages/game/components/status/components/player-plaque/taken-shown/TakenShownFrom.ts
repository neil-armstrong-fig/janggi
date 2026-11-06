import type {GameState} from "@janggi/engine/types/GameState";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {takenFrom} from "@janggi/engine/scoring/TakenFrom";

/** What a plaque shows as taken from nobody. */
const NOTHING: readonly PieceType[] = [];

interface Showing {
  readonly game: GameState;
  readonly side: Side;
  /** Whether the position was set up rather than played to — the tutorial's posed scenes. */
  readonly posed: boolean;
}

/**
 * What a plaque shows as taken from `side`. Taken is read off what is missing from a full army, so a position set up
 * with a few pieces would show nearly the whole army taken, none of it by a move: a posed position shows nothing.
 */
export function takenShownFrom({game, side, posed}: Showing): readonly PieceType[] {
  if (posed) return NOTHING;

  return takenFrom(game, side);
}
