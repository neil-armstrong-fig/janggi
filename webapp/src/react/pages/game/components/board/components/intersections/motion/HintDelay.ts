import type {Position} from "@src/game/board/types/Position";

/**
 * How long after a piece is picked up the mark on one of its destinations appears, in milliseconds:
 * the nearest first, the furthest last, so the marks spread outward from the piece in hand rather than
 * all blinking on at once — which shows where a piece reaches, and in what shape, before a single mark
 * has been read.
 *
 * Distance is counted in points along the longer axis. Nothing on a nine-by-ten board reaches further
 * than nine points, so the furthest mark any piece can have — a chariot's, down the length of the board
 * — still appears inside a fifth of a second, and needs no cap to keep it there.
 */
export function hintDelay(held: Position, destination: Position): number {
  const distance = Math.max(Math.abs(destination.file - held.file), Math.abs(destination.rank - held.rank));

  return (distance - 1) * PER_POINT_MS;
}

const PER_POINT_MS = 22;
