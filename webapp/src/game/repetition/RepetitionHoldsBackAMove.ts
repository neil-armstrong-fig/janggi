import type {GameState} from "@src/game/types/GameState";
import {isInCheck} from "@src/game/check/IsInCheck";
import {isRepetition} from "@src/game/repetition/IsRepetition";
import {piecesByPosition} from "@src/game/board/lookup/PiecesByPosition";
import {positionAfter} from "@src/game/utils/PositionAfter";
import {pseudoLegalMovesFrom} from "@src/game/moves/PseudoLegalMovesFrom";
import {underThirtyPointsEach} from "@src/game/utils/UnderThirtyPointsEach";

/**
 * Whether the army to move has a move the repetition rule is holding back — one that would be legal
 * but for standing the game in a position for the third time. See `docs/rules.md` §6.4.
 *
 * `movesFrom` refuses such a move without a word, the way it refuses a move into check, so on a board
 * it looks exactly like a move that never was. This is the question a page asks in order to say why.
 * It reports, as `isRepetition` does, and refuses nothing itself.
 *
 * The same two filters as `movesFrom`, one of them turned round: a move into check is no move the
 * repetition rule took away, so it does not count, and below thirty points a side nothing is held back
 * at all.
 */
export function repetitionHoldsBackAMove(state: GameState): boolean {
  if (underThirtyPointsEach(state)) return false;

  const pieces = piecesByPosition(state.pieces);
  const side = state.sideToMove;

  return state.pieces.some(
    ({piece, position: from}) =>
      piece.side === side &&
      pseudoLegalMovesFrom(pieces, from).some(to => {
        const after = positionAfter(state, {from, to});

        return !isInCheck(after, side) && isRepetition(after);
      }),
  );
}
