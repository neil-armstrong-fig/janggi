import type {GameState} from "@src/game/types/GameState";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {isInCheck} from "@src/game/check/IsInCheck";
import {legalMovesFor} from "@src/game/LegalMovesFor";

/**
 * Whether that army has been checkmated — 외통 — which is the only way a game of janggi is won.
 *
 * In check, and nothing it can play answers it. **Both halves matter**: unlike chess there is no
 * stalemate here, because a player with no legal move passes rather than losing, so having nothing
 * to play is only fatal while already in check. See `docs/rules.md` §6.3.
 *
 * Answers only for the army to move: a side cannot be mated on the opponent's turn, because it has
 * a move coming.
 */
export function isCheckmate(state: GameState, side: Side): boolean {
  if (state.sideToMove !== side) return false;

  return isInCheck(state, side) && legalMovesFor(state).length === 0;
}
