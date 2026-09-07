import type {Position, PositionKey} from "@src/react/pages/game/components/board/types/Position";

/** A position's stable identity, and the key a per-cell style override is stored under. */
export function toPositionKey({file, rank}: Position): PositionKey {
  return `f${file}r${rank}`;
}
