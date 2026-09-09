import type {GameState} from "@src/game/types/GameState";
import type {PositionKey} from "@src/game/board/types/Position";
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
 * A set of keys rather than a list of positions, because the board asks the question ninety times,
 * once per intersection.
 */
export function movablePieces(game: GameState): ReadonlySet<PositionKey> {
  return new Set(legalMovesFor(game).map(({from}) => toPositionKey(from)));
}
