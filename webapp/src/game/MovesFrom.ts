import type {GameState} from "@src/game/types/GameState";
import type {Move} from "@src/game/types/Move";
import type {Position} from "@src/game/board/types/Position";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {isInCheck} from "@src/game/check/IsInCheck";
import {isRepetition} from "@src/game/repetition/IsRepetition";
import {pieceAt} from "@src/game/board/utils/PieceAt";
import {piecesByPosition} from "@src/game/board/utils/PiecesByPosition";
import {positionAfter} from "@src/game/utils/PositionAfter";
import {pseudoLegalMovesFrom} from "@src/game/moves/PseudoLegalMovesFrom";
import {underThirtyPointsEach} from "@src/game/utils/UnderThirtyPointsEach";

/**
 * Everywhere the piece on one point may legally go, and nothing at all where no piece stands.
 *
 * Legal, not merely possible: a move that would leave its own general attacked is not on offer, so
 * a pinned piece cannot step off the pin and a general cannot walk onto a point the enemy covers.
 * That filter lives here, in one place, rather than in each of the seven movers.
 *
 * It deliberately does **not** care whose turn it is. "Where could this piece go" is the question a
 * board asks in order to light up the points a player may tap, and it is worth answering for either
 * army — so the filter is about the moving piece's own general, not about the side to move. Whose
 * turn it is becomes a rule one layer up, in `applyMove`.
 *
 * Two filters share the one trial position: the check, and the repetition a move would stand the
 * game in for a third time. Both are here rather than in `applyMove` so that the two agree by
 * construction — a board never lights up a point the rules would then refuse.
 */
export function movesFrom(state: GameState, from: Position): readonly Position[] {
  const pieces = piecesByPosition(state.pieces);

  const moving = pieceAt(pieces, from);
  if (!moving) return [];

  return pseudoLegalMovesFrom(pieces, from).filter(to => isPlayable(state, {from, to}, moving.side));
}

function isPlayable(state: GameState, move: Move, side: Side): boolean {
  const after = positionAfter(state, move);

  return !isInCheck(after, side) && !repeatsAThirdTime(state, after);
}

/**
 * "동일한 수를 3회 이상 반복할 수 없다. 단, 기물의 총 점수가 각각 30점 미만일 때에는 동일수를
 * 반복할 수 있다" — `docs/rules.md` §6.4. This is the one place clause ①'s exemption applies:
 * `isRepetition` reports the fact and says nothing about whether it is allowed.
 *
 * Note that this can leave a checked army with nothing to play, and `isCheckmate` will then say
 * mate. That is the honest consequence of a move a player may not make not being a legal move, and
 * in a perpetual check it falls on whichever side would complete the third standing first — the
 * closest an engine with no referee gets to 반복장군.
 */
function repeatsAThirdTime(state: GameState, after: GameState): boolean {
  return !underThirtyPointsEach(state) && isRepetition(after);
}
