import type {GameState} from "@src/game/types/GameState";
import type {PositionKey} from "@src/game/board/types/Position";
import {gameIsOver} from "@src/react/pages/game/components/board/components/intersections/movable-pieces/game-is-over/GameIsOver";
import {legalMovesFor} from "@src/game/LegalMovesFor";
import {toPositionKey} from "@src/game/board/PositionKeys";

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
 * Nowhere either while the board is still being laid out, which is the same problem from the other
 * end — the position on screen is only what `BoardShownFor.ts` is painting until both armies have
 * chosen, and no piece on it is anybody's to move yet.
 *
 * A set of keys rather than a list of positions, because the board asks the question ninety times,
 * once per intersection.
 */
export function movablePieces(game: GameState, playable: boolean): ReadonlySet<PositionKey> {
  if (!playable || gameIsOver(game)) return new Set();

  return new Set(legalMovesFor(game).map(({from}) => toPositionKey(from)));
}
