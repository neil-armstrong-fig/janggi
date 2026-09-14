import type {Move} from "@src/game/types/Move";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {Vector} from "@src/react/pages/game/components/board/types/Vector";
import {headingOf} from "@src/react/pages/game/components/board/components/impact/utils/HeadingOf";

/**
 * The shove a capture gives the board: along the line the capturing piece travelled, and as hard as
 * what it took was worth.
 *
 * Direction because a shake that points somewhere says where the blow came from, and strength because
 * a soldier is taken a dozen times a game and a chariot perhaps twice — the common capture has to be
 * all but felt rather than seen, so the rare one has room to land. Only the direction of the move
 * matters, not its length: a chariot taken from across the board is no harder a blow than one taken
 * from the next point.
 *
 * The figure is a kick to the spring's speed, in pixels a frame.
 */
export function shakeImpulse(move: Move, taken: PieceType): Vector {
  const heading = headingOf(move);
  const strength = STRENGTHS[taken];

  return {x: heading.x * strength, y: heading.y * strength};
}

/** In the order of the pieces' own values — `scoring/MaterialFor.ts` — with a general heaviest of all. */
const STRENGTHS: Record<PieceType, number> = {
  general: 2.5,
  chariot: 2,
  cannon: 1.4,
  horse: 1,
  elephant: 0.7,
  guard: 0.7,
  soldier: 0.35,
};
