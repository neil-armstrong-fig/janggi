/** Whether a value read from outside is a real number — not a string of one, and not NaN or Infinity. */
export function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}
