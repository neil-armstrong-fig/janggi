import type {NumberRange} from "@src/styles/limits/types/NumberRange";

/** A number held to a range: the nearest number in it, so the largest for one too large and the smallest for one too small. */
export function clampedTo({least, most}: NumberRange, value: number): number {
  return Math.min(most, Math.max(least, value));
}
