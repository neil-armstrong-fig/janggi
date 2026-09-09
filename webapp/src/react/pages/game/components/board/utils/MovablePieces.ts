import type {GameState} from "@src/game/types/GameState";
import type {PositionKey} from "@src/game/board/types/Position";
import {gameIsOver} from "@src/react/pages/game/components/board/utils/GameIsOver";
import {legalMovesFor} from "@src/game/LegalMovesFor";
import {toPositionKey} from "@src/game/board/utils/PositionKeys";

/**
 * Where a piece stands that its owner may move this turn.
 *
 * The engine already answers this: `legalMovesFor` gives every move the army to move may make, and
 * the points those moves start from are exactly the pieces worth reaching for. A piece with no
 * legal move — pinned against its own general, or unable to answer a check — simply never appears
 * as a `from`, so nothing here has to know why it is stuck.
 *
 * Nowhere at all once the game is over: two rested turns stop a game whose position still has moves
 * in it, and marking a piece the board would then refuse to move is worse than marking none.
 *
 * A set of keys rather than a list of positions, because the board asks the question ninety times,
 * once per intersection.
 */
export function movablePieces(game: GameState): ReadonlySet<PositionKey> {
  if (gameIsOver(game)) return new Set();

  return new Set(legalMovesFor(game).map(({from}) => toPositionKey(from)));
}
