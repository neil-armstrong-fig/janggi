import type {GameState} from "@src/game/types/GameState";
import type {Position, PositionKey} from "@src/game/board/types/Position";
import {canCallBikjangAfter} from "@src/game/bikjang/CanCallBikjangAfter";
import {toPositionKey} from "@src/game/board/PositionKeys";

/**
 * Of the points the piece in question may go to, the ones where the move would leave the opponent a
 * bikjang to call — `canCallBikjangAfter`, so the format's own answer. It is a warning and never a
 * bar: the move stays offered, a bikjang being as often what a player is after as what they are
 * avoiding.
 *
 * Handed the destinations rather than working them out, so it asks the engine only about moves that
 * `movesFrom` has already allowed, and so it costs nothing while no piece is in question.
 */
export function bikjangRisksFor(
  game: GameState,
  from: Position | undefined,
  destinations: readonly Position[],
): ReadonlySet<PositionKey> {
  if (!from) return NO_RISKS;

  return new Set(destinations.filter(to => canCallBikjangAfter(game, {from, to})).map(toPositionKey));
}

/** A stable empty set, so a board with nothing in hand does not hand every cell a new one each render. */
const NO_RISKS: ReadonlySet<PositionKey> = new Set();
