import type {Position, PositionKey} from "@janggi/engine/board/types/Position";

/** A position's stable identity, and the key a per-cell style override is stored under. */
export function toPositionKey({file, rank}: Position): PositionKey {
  return `f${file}r${rank}`;
}
