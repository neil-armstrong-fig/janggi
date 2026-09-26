import type {GameState} from "@src/game/types/GameState";
import type {Position, PositionKey} from "@src/game/board/types/Position";
import type {TourStepName} from "@src/redux/onboarding/touring/TourStepName";
import {movablePieces} from "@src/react/pages/game/components/board/components/intersections/movable-pieces/MovablePieces";
import {toPositionKey} from "@src/game/board/PositionKeys";

/** What the board is doing as the tour looks at it. */
interface Situation {
  readonly step: TourStepName | undefined;
  readonly game: GameState;
  /** Whether the player may touch the board at all. */
  readonly playable: boolean;
  /** The piece in hand, if one is. */
  readonly selected: Position | undefined;
  /** Where the piece in hand may go. */
  readonly destinations: readonly Position[];
}

/**
 * The one point on the board the tour is pointing at, or undefined where it points at none.
 *
 * Picking up asks for a piece of the army to move, a soldier where there is one for being the easiest to
 * make sense of; moving asks for a place the piece in hand may go — one step to its right where it can,
 * since a soldier sliding sideways is a sound way to open where a step forward is not — and until one is in
 * hand it asks for the
 * piece again, so a player who went on without picking anything up is still shown where to begin. A board
 * nobody may touch yet has no point to give.
 */
export function tourPointOf({step, game, playable, selected, destinations}: Situation): PositionKey | undefined {
  if (step === "move" && selected !== undefined) {
    const destination = sidewaysToTheRight(selected, destinations) ?? destinations[0];

    return destination && toPositionKey(destination);
  }
  if (step !== "pick-up" && step !== "move") return undefined;

  return pieceToPickUp(game, playable);
}

function sidewaysToTheRight(from: Position, destinations: readonly Position[]): Position | undefined {
  return destinations.find(({file, rank}) => rank === from.rank && file === from.file + 1);
}

function pieceToPickUp(game: GameState, playable: boolean): PositionKey | undefined {
  const movable = movablePieces(game, playable);
  const movablePlaced = game.pieces.filter(({position}) => movable.has(toPositionKey(position)));
  const easiest = movablePlaced.find(({piece}) => piece.type === "soldier") ?? movablePlaced[0];

  return easiest && toPositionKey(easiest.position);
}
