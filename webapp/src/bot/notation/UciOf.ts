import type {Move} from "@janggi/engine/types/Move";
import {squareOf} from "@src/bot/notation/squares/SquareOf";

/** A move as the engine writes one — the two squares run together, `a4a5`. */
export function uciOf({from, to}: Move): string {
  return `${squareOf(from)}${squareOf(to)}`;
}
