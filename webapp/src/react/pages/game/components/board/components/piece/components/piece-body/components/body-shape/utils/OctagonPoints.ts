import {CENTRE} from "@src/react/pages/game/components/board/components/piece/utils/PieceViewBox";

/**
 * A regular octagon, as an SVG `points` list, turned so it has a flat top and bottom — which is the
 * shape a real janggi piece is cut to, and the orientation that leaves a level edge for the
 * character to sit square against.
 */
export function octagonPoints(radius: number): string {
  return VERTEX_ANGLES.map(angle => vertex(angle, radius)).join(" ");
}

function vertex(angle: number, radius: number): string {
  const x = CENTRE + radius * Math.cos(angle);
  const y = CENTRE + radius * Math.sin(angle);

  return `${round(x)},${round(y)}`;
}

function round(value: number): string {
  return value.toFixed(2);
}

/**
 * Eight vertices, the first offset half a step so that a pair of them shares a y and the top edge
 * comes out level. Without the offset the octagon would stand on a point.
 */
const STEP = Math.PI / 4;
const VERTEX_ANGLES: readonly number[] = [0, 1, 2, 3, 4, 5, 6, 7].map(index => STEP * index + STEP / 2);
